import PageTemplate from "../PageTemplate";

export default function Kelahiran() {
	return (
		<PageTemplate
			title="Kejadian — Kelahiran"
			breadcrumb="Home / Kejadian / Kelahiran"
			color="bg-emerald-100 text-emerald-700">
			<p>
				Halaman ini mencatat data kelahiran pedet (anak sapi) dari induk yang
				terdaftar dalam sistem.
			</p>
			<p>
				Informasi mencakup tanggal lahir, jenis kelamin pedet, bobot lahir, kondisi
				kesehatan, dan ID induk.
			</p>
			<p>
				Data kelahiran digunakan untuk pembaruan populasi ternak dan perencanaan
				program budidaya berikutnya.
			</p>
		</PageTemplate>
	);
}
