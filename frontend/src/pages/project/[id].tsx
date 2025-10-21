import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Position,
} from '@xyflow/react';

import { getProject, updateProject } from '@/api/project';
import { updateSource, createSource } from '@/api/source';
import { createDestination, updateDestination } from '@/api/destination';

import { PageHeader } from '@/components/layout/PageHeader';
import { AppToast } from '@/components/layout/AppToast';
import { PageLoader } from '@/components/layout/PageLoader';

import { SourceNode } from '@/components/project/SourceNode';
import { ProjectNode } from '@/components/project/ProjectNode';
import { DestinationNode } from '@/components/project/DestinationNode';
import { AddButtonNode } from '@/components/project/AddButtonNode';
import { SourceModal } from '@/components/source/SourceModal';
import { ProjectModal } from '@/components/project/ProjectEditModal';
import { DestinationModal } from '@/components/destination/DestinationEditModal';

import { type SourceDataEdit } from '@/types/source';
import { type ProjectData } from '@/types/project';
import { type Project, type Destination } from '@/types/models';
import { AxiosError } from 'axios';

// Memoized node types to prevent recreation
const nodeTypes = {
  sourceNode: SourceNode,
  projectNode: ProjectNode,
  destinationNode: DestinationNode,
  addButtonNode: AddButtonNode,
};

// Types for better type safety
interface SourceWithHandlers {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  urlPath: string;
  token?: string;
  projectId: string;
  onClick: (src: SourceWithHandlers) => void;
}

interface DestinationWithHandlers {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  url: string;
  secret: string;
  retryPolicy?: any;
  timeoutMs: number;
  projectId: string;
  onClick: (dest: DestinationWithHandlers) => void;
}

// Memoized utility functions
const createSourceNodes = (
  sources: SourceWithHandlers[],
  projectId: string,
  onSourceClick: (src: SourceWithHandlers) => void,
  onAddSource: (projectId: string) => void
): Node[] => {
  const sourceNodes = sources.map((src, i) => ({
    id: `source-${src.id}`,
    position: { x: 0, y: i * 120 },
    sourcePosition: Position.Right,
    type: 'sourceNode' as const,
    data: {
      ...src,
      onClick: onSourceClick,
    },
  }));

  const addSourceNode: Node = {
    id: 'add-source',
    position: { x: 0, y: sources.length * 120 },
    type: 'addButtonNode' as const,
    data: {
      label: 'Add new source',
      onClick: () => onAddSource(projectId),
    },
  };

  return [...sourceNodes, addSourceNode];
};

const createDestinationNodes = (
  dests: DestinationWithHandlers[],
  projectId: string,
  onDestClick: (dest: DestinationWithHandlers) => void,
  onAddDest: (projectId: string) => void
): Node[] => {
  const destNodes = dests.map((dest, i) => ({
    id: `dest-${dest.id}`,
    position: { x: 800, y: i * 120 },
    targetPosition: Position.Left,
    type: 'destinationNode' as const,
    data: {
      ...dest,
      onClick: onDestClick,
    },
  }));

  const addDestNode: Node = {
    id: 'add-dest',
    position: { x: 800, y: dests.length * 120 },
    type: 'addButtonNode' as const,
    data: {
      label: 'Add new destination',
      onClick: () => onAddDest(projectId),
    },
  };

  return [...destNodes, addDestNode];
};

const createProjectNode = (
  project: Project,
  onProjectClick: (projectData: ProjectData) => void
): Node => ({
  id: `project-${project.id}`,
  position: { x: 400, y: 150 },
  targetPosition: Position.Left,
  sourcePosition: Position.Right,
  type: 'projectNode' as const,
  data: {
    id: project.id,
    name: project.name,
    description: project.description,
    retentionDays: project.retentionDays,
    onClick: onProjectClick,
  },
});

const createSourceEdges = (
  sources: SourceWithHandlers[],
  projectId: string
): Edge[] =>
  sources.map((src) => ({
    id: `e-source-${src.id}`,
    source: `source-${src.id}`,
    target: `project-${projectId}`,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#0ea5e9', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
  }));

const createDestinationEdges = (
  dests: DestinationWithHandlers[],
  projectId: string
): Edge[] =>
  dests.map((dest) => ({
    id: `e-dest-${dest.id}`,
    source: `project-${projectId}`,
    target: `dest-${dest.id}`,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#0ea5e9', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
  }));

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();

  // Consolidated state management
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [modals, setModals] = useState({
    source: { open: false, editingData: null as SourceWithHandlers | null },
    project: { open: false, editingData: null as Project | null },
    destination: {
      open: false,
      editingData: null as DestinationWithHandlers | null,
    },
  });

  const [loadingStates, setLoadingStates] = useState({
    source: false,
    project: false,
    destination: false,
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  // Optimized event handlers with useCallback
  const handleSourceClick = useCallback((src: SourceWithHandlers) => {
    setModals((prev) => ({
      ...prev,
      source: { open: true, editingData: src },
    }));
  }, []);

  const handleAddSource = useCallback((projectId: string) => {
    setModals((prev) => ({
      ...prev,
      source: { open: true, editingData: { projectId } as SourceWithHandlers },
    }));
  }, []);

  const handleProjectEditClick = useCallback((projectData: ProjectData) => {
    setModals((prev) => ({
      ...prev,
      project: { open: true, editingData: projectData as Project },
    }));
  }, []);

  const handleDestClick = useCallback((dest: DestinationWithHandlers) => {
    setModals((prev) => ({
      ...prev,
      destination: { open: true, editingData: dest },
    }));
  }, []);

  const handleAddDestClick = useCallback((projectId: string) => {
    setModals((prev) => ({
      ...prev,
      destination: {
        open: true,
        editingData: { projectId } as DestinationWithHandlers,
      },
    }));
  }, []);

  // Helper function to update nodes efficiently
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, []);

  // Helper function to add new nodes and edges
  const addNewNodeAndEdge = useCallback(
    (
      newNode: Node,
      newEdge: Edge,
      nodeType: 'sourceNode' | 'destinationNode',
      addButtonId: string
    ) => {
      setNodes((prev) => {
        const otherNodes = prev.filter(
          (n) => n.type !== nodeType && n.id !== addButtonId
        );
        const currentNodes = prev
          .filter((n) => n.type === nodeType)
          .map((n) => n.data);

        if (nodeType === 'sourceNode') {
          return [
            ...createSourceNodes(
              [...currentNodes, newNode.data] as any,
              newNode.data.projectId as string,
              handleSourceClick,
              handleAddSource
            ),
            ...otherNodes,
          ];
        } else {
          return [
            ...createDestinationNodes(
              [...currentNodes, newNode.data] as any,
              newNode.data.projectId as string,
              handleDestClick,
              handleAddDestClick
            ),
            ...otherNodes,
          ];
        }
      });

      setEdges((prev) => [...prev, newEdge]);
    },
    [handleSourceClick, handleAddSource, handleDestClick, handleAddDestClick]
  );

  const handleSourceSubmit = useCallback(
    async (formData: SourceDataEdit) => {
      try {
        setLoadingStates((prev) => ({ ...prev, source: true }));

        if (formData.id) {
          // Update existing source
          const updateData = {
            id: formData.id,
            projectId: formData.projectId,
            name: formData.name,
            status: formData.status,
            urlPath: formData.urlPath,
            token: formData.token,
          };

          const res = await updateSource(updateData);
          if (res?.status) {
            AppToast.success('Source updated successfully');
            updateNodeData(`source-${formData.id}`, formData);
          } else {
            AppToast.error(
              res?.message ?? 'Failed to update source. Please try again.'
            );
          }
        } else {
          // Create new source
          const createData = {
            projectId: formData.projectId,
            name: formData.name,
            status: formData.status,
            urlPath: formData.urlPath,
            token: formData.token,
          };

          const res = await createSource(createData);
          if (res?.status) {
            AppToast.success('Source created successfully');
            const newSource = res.data;

            const newNode: Node = {
              id: `source-${newSource.id}`,
              position: { x: 0, y: 0 }, // Position will be calculated in createSourceNodes
              sourcePosition: Position.Right,
              type: 'sourceNode',
              data: { ...newSource, onClick: handleSourceClick },
            };

            const newEdge: Edge = {
              id: `e-source-${newSource.id}`,
              source: `source-${newSource.id}`,
              target: `project-${formData.projectId}`,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#0ea5e9', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
            };

            addNewNodeAndEdge(newNode, newEdge, 'sourceNode', 'add-source');
          } else {
            AppToast.error(
              res?.message ?? 'Failed to create source. Please try again.'
            );
          }
        }

        setModals((prev) => ({
          ...prev,
          source: { open: false, editingData: null },
        }));
      } catch (err) {
        console.error('Error saving source:', err);
        const axiosErr = err as AxiosError<{ message?: string }>;
        const serverMessage = axiosErr.response?.data?.message;
        AppToast.error(
          serverMessage ?? 'Failed to save source. Please try again.'
        );
      } finally {
        setLoadingStates((prev) => ({ ...prev, source: false }));
      }
    },
    [updateNodeData, addNewNodeAndEdge, handleSourceClick]
  );

  const handleUpdateProject = useCallback(
    async (projectData: Project) => {
      try {
        setLoadingStates((prev) => ({ ...prev, project: true }));

        const res = await updateProject({
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          retentionDays: projectData.retentionDays,
        });

        if (res?.status) {
          AppToast.success('Project updated successfully');
          updateNodeData(`project-${projectData.id}`, {
            name: projectData.name,
            description: projectData.description,
            retentionDays: projectData.retentionDays,
          });
        } else {
          AppToast.error(
            res?.message ?? 'Failed to update project. Please try again.'
          );
        }

        setModals((prev) => ({
          ...prev,
          project: { open: false, editingData: null },
        }));
      } catch (err) {
        console.error('Error updating project:', err);
        const axiosErr = err as AxiosError<{ message?: string }>;
        const serverMessage = axiosErr.response?.data?.message;
        AppToast.error(
          serverMessage ?? 'Failed to update project. Please try again.'
        );
      } finally {
        setLoadingStates((prev) => ({ ...prev, project: false }));
      }
    },
    [updateNodeData]
  );

  const handleUpdateDestination = useCallback(
    async (destinationData: Destination) => {
      try {
        setLoadingStates((prev) => ({ ...prev, destination: true }));

        if (destinationData.id) {
          // Update existing destination
          const updateData = {
            id: destinationData.id,
            projectId: destinationData.projectId,
            name: destinationData.name,
            status: destinationData.status,
            url: destinationData.url,
            secret: destinationData.secret,
            retryPolicy: destinationData.retryPolicy,
            timeoutMs: destinationData.timeoutMs,
          };

          const res = await updateDestination(updateData);
          if (res?.status) {
            AppToast.success('Destination updated successfully');
            updateNodeData(`dest-${destinationData.id}`, destinationData);
          } else {
            AppToast.error(
              res?.message ?? 'Failed to update destination. Please try again.'
            );
          }
        } else {
          // Create new destination
          const createData = {
            projectId: destinationData.projectId,
            name: destinationData.name,
            status: destinationData.status,
            url: destinationData.url,
            secret: destinationData.secret,
            retryPolicy: destinationData.retryPolicy,
            timeoutMs: destinationData.timeoutMs,
          };

          const res = await createDestination(createData);
          if (res?.status) {
            AppToast.success('Destination created successfully');
            const newDest = res.data;

            const newNode: Node = {
              id: `dest-${newDest.id}`,
              position: { x: 800, y: 0 }, // Position will be calculated in createDestinationNodes
              targetPosition: Position.Left,
              type: 'destinationNode',
              data: { ...newDest, onClick: handleDestClick },
            };

            const newEdge: Edge = {
              id: `e-dest-${newDest.id}`,
              source: `project-${destinationData.projectId}`,
              target: `dest-${newDest.id}`,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#0ea5e9', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
            };

            addNewNodeAndEdge(newNode, newEdge, 'destinationNode', 'add-dest');
          } else {
            AppToast.error(
              res?.message ?? 'Failed to create destination. Please try again.'
            );
          }
        }

        setModals((prev) => ({
          ...prev,
          destination: { open: false, editingData: null },
        }));
      } catch (err) {
        console.error('Error saving destination:', err);
        const axiosErr = err as AxiosError<{ message?: string }>;
        const serverMessage = axiosErr.response?.data?.message;
        AppToast.error(
          serverMessage ?? 'Failed to save destination. Please try again.'
        );
      } finally {
        setLoadingStates((prev) => ({ ...prev, destination: false }));
      }
    },
    [updateNodeData, addNewNodeAndEdge, handleDestClick]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const res = await getProject(id);
        if (res.status) {
          const project = res.data;

          // Build all nodes and edges
          const sourceNodes = createSourceNodes(
            project.sources,
            project.id,
            handleSourceClick,
            handleAddSource
          );

          const projectNode = createProjectNode(
            project,
            handleProjectEditClick
          );

          const destNodes = createDestinationNodes(
            project.destinations,
            project.id,
            handleDestClick,
            handleAddDestClick
          );

          const sourceEdges = createSourceEdges(project.sources, project.id);
          const destEdges = createDestinationEdges(
            project.destinations,
            project.id
          );

          setNodes([...sourceNodes, projectNode, ...destNodes]);
          setEdges([...sourceEdges, ...destEdges]);
        } else {
          AppToast.error(res.message || 'Failed to load project data');
        }
      } catch (err) {
        console.error('Error fetching project data:', err);
        const axiosErr = err as AxiosError<{ message?: string }>;
        const serverMessage = axiosErr.response?.data?.message;
        AppToast.error(
          serverMessage ?? 'Failed to fetch project data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    id,
    handleSourceClick,
    handleAddSource,
    handleProjectEditClick,
    handleDestClick,
    handleAddDestClick,
  ]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
      <PageHeader
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Projects', href: '/project' },
          { label: 'Edit' },
        ]}
      />

      <div className="relative w-full h-[calc(100vh-15rem)] bg-card rounded-lg border border-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
        />
      </div>

      <SourceModal
        open={modals.source.open}
        onClose={() =>
          setModals((prev) => ({
            ...prev,
            source: { open: false, editingData: null },
          }))
        }
        initialData={modals.source.editingData || undefined}
        onSave={(data) => handleSourceSubmit(data as SourceDataEdit)}
        disableProjectId={true}
        loading={loadingStates.source}
      />

      <ProjectModal
        open={modals.project.open}
        onClose={() =>
          setModals((prev) => ({
            ...prev,
            project: { open: false, editingData: null },
          }))
        }
        initialData={
          modals.project.editingData
            ? {
                id: modals.project.editingData.id,
                name: modals.project.editingData.name,
                description: modals.project.editingData.description,
                retentionDays: modals.project.editingData.retentionDays || 30,
              }
            : undefined
        }
        onSave={(data) => handleUpdateProject(data as Project)}
        loading={loadingStates.project}
      />

      <DestinationModal
        open={modals.destination.open}
        onClose={() =>
          setModals((prev) => ({
            ...prev,
            destination: { open: false, editingData: null },
          }))
        }
        initialData={modals.destination.editingData || undefined}
        onSave={(data) => handleUpdateDestination(data as Destination)}
        disableProjectId={true}
        loading={loadingStates.destination}
      />
    </div>
  );
}
