import Link from "next/link";

export default function Foo() {
  return (
    <main className="w-full h-screen">
      <div className="flex h-full justify-center items-center font-semibold">Foo page <Link href='/'>goto home</Link></div>
    </main>
  );
}
