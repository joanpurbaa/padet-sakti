import type { ReactNode } from "react";

export interface PageTemplateProps {
	title: string;
	breadcrumb: string;
	color?: string;
	children: ReactNode;
}
