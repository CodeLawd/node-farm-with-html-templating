const http = require("http");
const fs = require("fs");
const url = require("url");
const slugify = require("slugify");

const replaceTemplate = require("./modules/functions");

tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// replaceTemplate function
const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);

console.log(slugs)

const server = http.createServer((req, res) => {
  //   let pathname = req.url;
  const { pathname, query } = url.parse(req.url, true);
  console.log(query.id);

  // ---------OVERVIEW OR HOME ROUTE
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{% product_card %}/g, cardHTML);
    res.end(output);

    // --------- API ROUTE
  } else if (pathname == "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // --------- PRODUCT ROUTE
  } else if (pathname == "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //------------ 404 ROUTE
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1> Page Not Found </h1>");
  }
});

server.listen(3000, console.log("Server listening on port 3000"));
