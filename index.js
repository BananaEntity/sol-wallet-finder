import child_process from "child_process";

const fork = child_process.fork;
const threads = 4;
const handles = [];
const prefix = "";

for (let index = 0; index < threads; index++) {
  const f = fork(`./mint-wallet.js`, [`--p=${prefix}`]);
  f.on("message", (code) => {
    if (code !== "found") return;
    // stop all others
    for (let i = 0; i < handles.length; i++) {
      handles[i].send({ stop: true });
    }
  });
  handles.push(f);
}
console.log("working...");
