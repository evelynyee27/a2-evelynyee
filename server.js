const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you're testing this on your local machine.
  // On Render, make sure `npm install` is your build command.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

// const appdata = [
//   { 'model': 'toyota', 'year': 1999, 'mpg': 23 },
//   { 'model': 'honda', 'year': 2004, 'mpg': 30 },
//   { 'model': 'ford', 'year': 1987, 'mpg': 14}
// ]

const appdata = [
  {
    title: "note 1",
    message: "description of note 1",
    status: "incomplete",
    due: "2027-01-01",
    important: "no",
  },
  {
    title: "note 2",
    message: "description of note 2",
    status: "complete",
    due: "2027-01-01",
    important: "no",
  },
  {
    title: "note 3",
    message: "description of note 3",
    status: "incomplete",
    due: "2027-01-01",
    important: "no",
  },
];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  } else if (request.method === "DELETE") {
    handleDelete(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/data") {
    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  } else {
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    if (request.url === "/submit") {
      appdata.push(JSON.parse(dataString));
    }

    response.writeHead(200, "OK", { "Content-Type": "application/json" });

    response.end(JSON.stringify(appdata));
  });
};

const handleDelete = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const { title } = JSON.parse(dataString);

    if (request.url === "/delete") {
      const index = appdata.findIndex((note) => note.title === title);

      if (index === -1) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Note not found" }));
        return;
      }

      appdata.splice(index, 1);
    }

    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
