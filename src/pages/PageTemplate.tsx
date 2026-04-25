import type { PageTemplateProps } from "../types/PageTemplate";

export default function PageTemplate({
	title,
	breadcrumb,
	color = "bg-blue-100 text-blue-700",
	children,
}: PageTemplateProps) {
	return (
		<div className="bg-white rounded-lg shadow-sm p-8">
			<p className="text-gray-400 text-xs mb-1">{breadcrumb}</p>

			<h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>

			<div
				className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 ${color}`}>
				{title}
			</div>

			<div className="text-gray-500 leading-relaxed space-y-3">{children}</div>
		</div>
	);
}
