import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Foo() {
  const [l, setL] = useState(0);

  const { pathname } = useRouter();

  useRouter();
  // useEffect(() => {
  //   console.log('update');
  // },[])

  useEffect(() => {
    console.log("bbbb");
  }, []);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setL(l => l + 1);
  //   }, 200)

  //   return () => clearInterval(id);
  // }, [])

  const [j] = useState(() => "oooo");

  return (
    <main className="w-full h-screen">
      <h2 className="text-center mt-6 text-[20px] text-[green] font-semibold font-mono">
        This is <span>Foo</span> {l} Page
      </h2>
      <div className="w-[50%] h-[400px] m-auto mt-6 overflow-auto">
        <label>
          Text input: <input name="myInput" value="00000" className="text-black" />
        </label>
        <label>
          Checkbox: <input type="checkbox" name="myCheckbox" checked />
        </label>
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
        <button
          onClick={() => {
            console.log(456);
          }}
          // onClickCapture={() => {
          //   console.log('456', 'capture')
          // }}
        >
          {" "}
          click
        </button>
      </div>
    </main>
  );
}
