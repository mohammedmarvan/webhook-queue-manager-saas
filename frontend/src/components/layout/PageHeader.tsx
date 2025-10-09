import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PageHeaderProps {
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHeader({ breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      {breadcrumb && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, idx) => (
              <BreadcrumbItem key={idx}>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
                {idx < breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
}
