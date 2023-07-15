import Link from "next/link";

export default function Foo() {
  return (
    <main className="w-full h-screen">
      <h2 className="text-center mt-6 text-[20px] text-[green] font-semibold font-mono">
        This is <span>Foo</span> Page
      </h2>
      <div className="w-[50%] h-[400px] m-auto mt-6 overflow-auto">
        <code>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, suscipit. Reprehenderit voluptatum sit fugiat! Cumque perspiciatis itaque vel ex
          rerum fuga praesentium doloribus dicta dolorum harum sit amet sunt magni magnam temporibus voluptatum soluta alias, corporis iusto consequuntur
          mollitia. Amet earum eligendi aut magnam obcaecati minus esse quas sed facilis corrupti veritatis dolorum ex officiis, modi ducimus hic doloremque
          laudantium fugit vitae reiciendis officia magni deserunt ea voluptatibus? Dolorem, recusandae, sit natus repellat quo ex nam facere doloremque nemo,
          eligendi similique temporibus? Illum nulla consequuntur, eos, iure libero dolor assumenda ducimus nesciunt unde necessitatibus nostrum magni ut
          perferendis, eius dolorem!
        </code>
      </div>
      <div className="flex items-center justify-center">
        <div
          className="border border-[gray] px-2 py-1 rounded-lg underline underline-offset-4 text-[18px] text-[green] cursor-pointer relative z-20"
          title="Go to Foo Page"
        >
          <Link href="/">Goto Home Page</Link>
        </div>
      </div>
    </main>
  );
}
