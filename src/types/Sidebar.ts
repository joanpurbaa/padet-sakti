import type { ReactNode } from "react";

export interface SideNavItemProps {
	to: string;
	icon: ReactNode;
	label: string;
	collapsed: boolean;
}

export interface KejadianSubItem {
	label: string;
	to: string;
}
