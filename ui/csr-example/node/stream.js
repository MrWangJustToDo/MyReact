const http = require("http");
const fs = require("fs");
const path = require("path");

const app = http.createServer((req, res) => {
  console.log("Request received");
  res.writeHead(200, { "content-type": "stream/text", "access-control-allow-origin": "*" });
  const fsStream = fs.createReadStream(path.resolve(process.cwd(), "node", "./server.js"));
  const webStream = require("stream").Readable.toWeb(fsStream, { strategy: { highWaterMark: 10 } });
  webStream
    .pipeThrough(
      new TransformStream(
        {
          async transform(chunk, controller) {
            for (let i = 0; i < chunk.length; i++) {
              while (controller.desiredSize < 0) {
                await new Promise((resolve) => setTimeout(resolve, 1));
              }
              controller.enqueue(chunk.slice(i, i + 1));
            }
          },
        },
        { highWaterMark: 1024 },
        { highWaterMark: 1024 }
      )
    )
    .pipeThrough(
      new TransformStream(
        {
          async transform(chunk, controller) {
            controller.enqueue(chunk);
            await new Promise((resolve) => setTimeout(resolve, 10));
          },
        },
      )
    )
    .pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          console.log("write Stream closed");
          res.end();
        },
        abort(err) {
          console.error("write Stream error:", err);
          res.end();
        },
      })
    );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

const getStream1 = async () => {
  const response = await fetch("http://localhost:3000/stream");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  const reader = inputStream.getReader();
  let result = null;
  let len = "";
  while (!(result = await reader.read()).done) {
    if (result.value === "\n") {
      console.log("Received line:", len);
      len = "";
    } else {
      len += result.value;
    }
  }
};

const getStream2 = async () => {
  const response = await fetch("http://localhost:3000/stream");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  let len = "";
  for await (const chunk of inputStream) {
    if (chunk === "\n") {
      console.log("Received line:", len);
      len = "";
    } else {
      len += chunk;
    }
  }
};

const getStream3 = async () => {
  const response = await fetch("http://localhost:3000/stream");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  let len = "";
  inputStream
    .pipeTo(
      new WritableStream({
        write(chunk) {
          if (chunk === "\n") {
            console.log("Received line:", len);
            len = "";
          } else {
            len += chunk;
          }
        },
        close() {
          console.log("Stream closed");
        },
        abort(err) {
          console.error("Stream error:", err);
        },
      })
    )
    .catch((err) => {
      console.error("PipeTo error:", err);
    });
};

const getStream4 = async () => {
  const response = await fetch("http://localhost:3000/stream");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", { fatal: true }));
  let len = "";
  const wrapperReader = async function* (reader) {
    let result = null;
    while (!(result = await reader.read()).done) {
      yield result.value;
    }
    return;
  };
  const reader = inputStream.getReader();
  for await (const chunk of wrapperReader(reader)) {
    if (chunk === "\n") {
      console.log("Received line:", len);
      len = "";
    } else {
      len += chunk;
    }
  }
};
