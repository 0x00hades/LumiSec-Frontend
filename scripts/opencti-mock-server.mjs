import http from "http";

const server = http.createServer((req, res) => {
  if (req.url?.includes("/graphql")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: { indicatorAdd: { id: "mock-indicator", name: "Phishing mock" } } }));
    return;
  }
  res.writeHead(404).end();
});

server.listen(8080, () => {
  console.log("OpenCTI mock listening on :8080");
});
