import express, {Request, Response} from "express";

const app = express();

app.use(express.json()); // lets me read req.body

//GET

app.get("/", (_req: Request, res Response) => {
    res.send("ok all good");
});

// GET /hello?name=Victor

app.get("/hello",(req: Request, res: Response) => {
    const name = typeof req.query.name === "string" ? req.query.name : "world";
    res.json( {message: `Hello, ${name}!`})
});

// POST

app.post("/sum", (req: Request, res: Response) => {
    const a = Number(req.body?.a);
    const b = Number(req.body?.b);
    if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: "Send JSON like { a: number, b: number }" });
}
    return res.json({ a, b, sum: a + b });
});

app.listen(3000, () => {
    console.log("running")
})