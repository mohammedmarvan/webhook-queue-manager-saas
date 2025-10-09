import { PageHeader } from "@/components/layout/PageHeader"

export default function Project() {

    return(
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <PageHeader 
                breadcrumb={[
                    { label: "Home", href: "/dashboard" },
                    { label: "Projects" },
                    ]}
            />
        </div>
    )
}