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

const nodeTypes = {
  sourceNode: SourceNode,
  projectNode: ProjectNode,
  destinationNode: DestinationNode,
  addButtonNode: AddButtonNode,
};

// Utility functions
const createSourceNodes = (
  sources: any[],
  projectId: string,
  onSourceClick: (src: any) => void,
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
  dests: any[],
  projectId: string,
  onDestClick: (dest: any) => void,
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
  project: any,
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

const createSourceEdges = (sources: any[], projectId: string): Edge[] =>
  sources.map((src) => ({
    id: `e-source-${src.id}`,
    source: `source-${src.id}`,
    target: `project-${projectId}`,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#0ea5e9', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
  }));

const createDestinationEdges = (dests: any[], projectId: string): Edge[] =>
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
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [openSourceModal, setOpenSourceModal] = useState(false);
  const [editingSource, setEditingSource] = useState<any | null>(null);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [openDestModal, setOpenDestModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any | null>(
    null
  );

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

  // Event handlers
  const handleSourceClick = (src: any) => {
    setEditingSource(src);
    setOpenSourceModal(true);
  };

  const handleAddSource = (projectId: string) => {
    setEditingSource({ projectId });
    setOpenSourceModal(true);
  };

  const handleProjectEditClick = (projectData: ProjectData) => {
    setEditingProject(projectData);
    setOpenProjectModal(true);
  };

  const handleDestClick = (dest: any) => {
    setEditingDestination(dest);
    setOpenDestModal(true);
  };

  const handleAddDestClick = (projectId: string) => {
    setEditingDestination({ projectId });
    setOpenDestModal(true);
  };

  const handleSourceSubmit = async (formData: SourceDataEdit) => {
    try {
      setLoading(true);

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
          AppToast.success('Updated source successfully');
          setNodes((prev) =>
            prev.map((node) =>
              node.id === `source-${formData.id}`
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      ...formData,
                    },
                  }
                : node
            )
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
          AppToast.success('Created source successfully');

          const newSource = res.data;
          setNodes((prev) => {
            const otherNodes = prev.filter(
              (n) => n.type !== 'sourceNode' && n.id !== 'add-source'
            );

            const currentSources = prev
              .filter((n) => n.type === 'sourceNode')
              .map((n) => n.data);

            return [
              ...createSourceNodes(
                [...currentSources, newSource],
                formData.projectId,
                handleSourceClick,
                handleAddSource
              ),
              ...otherNodes,
            ];
          });

          setEdges((prev) => [
            ...prev,
            {
              id: `e-source-${newSource.id}`,
              source: `source-${newSource.id}`,
              target: `project-${formData.projectId}`,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#0ea5e9', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
            },
          ]);
        }
      }
      setOpenSourceModal(false);
    } catch (e) {
      AppToast.error('Error in updating source');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (projectData: Project) => {
    try {
      setLoading(true);
      const res = await updateProject({
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        retentionDays: projectData.retentionDays,
      });

      if (res?.status) {
        AppToast.success('Successfully updated the project');
        setNodes((prev) =>
          prev.map((node) =>
            node.id === `project-${projectData.id}`
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    name: projectData.name,
                    description: projectData.description,
                    retentionDays: projectData.retentionDays,
                  },
                }
              : node
          )
        );
      } else {
        AppToast.error('Something went wrong while updating the project');
      }
      setOpenProjectModal(false);
    } catch (err) {
      AppToast.error('Error in updating project');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDestination = async (destinationData: Destination) => {
    try {
      setLoading(true);

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
          AppToast.success('Updated destination successfully');
          setNodes((prev) =>
            prev.map((node) =>
              node.id === `dest-${destinationData.id}`
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      ...destinationData,
                    },
                  }
                : node
            )
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
          AppToast.success('Created destination successfully');

          const newDest = res.data;
          setNodes((prev) => {
            const otherNodes = prev.filter(
              (n) => n.type !== 'destinationNode' && n.id !== 'add-dest'
            );

            const currentDests = prev
              .filter((n) => n.type === 'destinationNode')
              .map((n) => n.data);

            return [
              ...createDestinationNodes(
                [...currentDests, newDest],
                destinationData.projectId,
                handleDestClick,
                handleAddDestClick
              ),
              ...otherNodes,
            ];
          });

          setEdges((prev) => [
            ...prev,
            {
              id: `e-dest-${newDest.id}`,
              source: `project-${destinationData.projectId}`,
              target: `dest-${newDest.id}`,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#0ea5e9', strokeWidth: 2 },
              markerEnd: { type: 'arrowclosed', color: '#0ea5e9' },
            },
          ]);
        }
      }
      setOpenDestModal(false);
    } catch (e) {
      AppToast.error('Error in updating destination');
    } finally {
      setLoading(false);
    }
  };

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
          AppToast.error(res.message || 'Something went wrong');
        }
      } catch (err) {
        AppToast.error('Failed to fetch project data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        open={openSourceModal}
        onClose={() => setOpenSourceModal(false)}
        initialData={editingSource}
        onSave={(data) => handleSourceSubmit(data as SourceDataEdit)}
        disableProjectId={true}
      />

      <ProjectModal
        open={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
        initialData={editingProject}
        onSave={(data) => handleUpdateProject(data as Project)}
      />

      <DestinationModal
        open={openDestModal}
        onClose={() => setOpenDestModal(false)}
        initialData={editingDestination}
        onSave={(data) => handleUpdateDestination(data as Destination)}
        disableProjectId={true}
      />
    </div>
  );
}
