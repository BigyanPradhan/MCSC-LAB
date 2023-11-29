const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const math = require('mathjs'); // Import the math.js library
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/css", express.static("css"));
app.use("/resources", express.static("resources"));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/q1', (req, res) => {
    // Get user inputs
    const equationInput = "x^4-sin(x)";
    const initialGuess1 = parseFloat(0.5);
    const initialGuess2 = parseFloat(1);
    const tol = 4;
    let a;
    let b;
    
    // Define tolerance and maximum iterations
    const tolerance = 1/Math.pow(10,tol);
    const maxIterations = 100;

    // Initialize iteration counter and x-value
    let iteration = 0;

    // Define the equation as a function
    const equationFunction = math.parse(equationInput).compile();

    const fxVal1 = equationFunction.evaluate({ x: initialGuess1 });
    
    //Set a and b according to their odd-even state
    if(fxVal1 < 0)
    {
        a = initialGuess1;
        b = initialGuess2;
    }
    else
    {
        b = initialGuess1;
        a = initialGuess2;
    }

    let resultsHTML= `<table><tr><th>Iteration</th><th>a</th><th>b</th><th>s</th><th>Remarks on f(s)</th></tr>`;

    while (iteration < maxIterations) {
        try {
            //Formula for bisection method
            s=(a+b)/2;

            //Calculate the function value at s
            const fxs = equationFunction.evaluate({ x: s });
            
            //Initiate remarks and it's conditions
            let Remarks;
            if(fxs<0)
            {
                Remarks= "f(s)<0";
            }
            else
            {
                Remarks= "f(s)>0";
            }

            // Check for convergence
            if (Math.abs(fxs) < tolerance) {
                break;
            }

            // Append current iteration details to results HTML
            resultsHTML += `<tr><td>${iteration}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td>${s.toFixed(6)}</td>
            <td>${Remarks}</td></tr>`;

            if (Math.abs(fxs) < tolerance) {
                break;
            }

            //Update the value with s
            if(fxs<0)
            {
                a=s;
            }
            else
            {
                b=s;
            }

            iteration++;
        } catch (error) {
            console.error(error);
            resultsHTML += `<tr><td colspan="3">Error occurred during evaluation.</td></tr>`;
            break;
        }
    }

    if (iteration === maxIterations) {
        resultsHTML += `<tr><td colspan="3">Maximum iterations reached. The method did not converge.</td></tr>`;
    }

    resultsHTML += '</table>';

    // Display the results
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bisection Method</title>
        <link rel="stylesheet" type="text/css" href="css/styles.css" />
    </head>
    <body background="resources/mcsc.png">
        <b>
        <h1>Bisection Method </h1>
        <h1>Solver</h1>
                <form id="solver-form" action="/" method="post">
                <div class="prev">
                <p> Equation = ${equationInput} </p>
                <p>Initial Guess:   a = ${initialGuess1} || b = ${initialGuess2}</p>
                <p>The Solution correct to ${tol} digits is found by:</p>
                </div>
                <div class="text">
                <p>${resultsHTML}</p>
                <p>Converged to solution:${s.toFixed(tol)}</p>

                <center>
                    <input type="submit" class="btn" value="Back">
                </center>
                </div>
                </form>
        </b>
    </body>
    </html>
`);
});

app.post('/q2', (req, res) => {
    // Get user inputs
    const equationInput = "e^x-4*x";
    const initialGuess = parseFloat(1);
    const tol = 6;
    // Define tolerance and maximum iterations
   
    const tolerance = 1/Math.pow(10,tol);
    const maxIterations = 100;

    // Initialize iteration counter and x-value
    let iteration = 0;
    let xVal = initialGuess;

    let resultsHTML= `<table><tr><th>Iteration</th><th>x</th><th>f(x)</th><th>f'(x)</th><th>x'n+1'</th></tr>`;

    // Define the equation as a function
    const equationFunction = math.parse(equationInput).compile();

    while (iteration < maxIterations) {
        try {
            // Calculate the function value and its derivative at xVal
            const fxVal = equationFunction.evaluate({ x: xVal });
            const dfxVal = math.derivative(equationInput, 'x').evaluate({ x: xVal });

            // Check for convergence
            if (Math.abs(fxVal) < tolerance) {
                break;
            }
            let calc = xVal - fxVal / dfxVal;
            // Append current iteration details to results HTML
            resultsHTML += `<tr><td>${iteration}</td><td>${xVal.toFixed(6)}</td><td>${fxVal.toFixed(6)}</td>
            <td>${dfxVal.toFixed(6)}</td><td>${calc.toFixed(6)}</td></tr>`;
            
            // Update x using the Newton-Raphson formula
            xVal = xVal - fxVal / dfxVal;

            iteration++;
        } catch (error) {
            console.error(error);
            resultsHTML += `<tr><td colspan="3">Error occurred during evaluation.</td></tr>`;
            break;
        }
    }

    if (iteration === maxIterations) {
        resultsHTML += `<tr><td colspan="3">Maximum iterations reached. The method did not converge.</td></tr>`;
    }

    resultsHTML += '</table>';

    // Display the results
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Newton-Raphson Solver</title>
        <link rel="stylesheet" type="text/css" href="css/styles.css" />
    </head>
    <body background="resources/mcsc.png">
        <b>
        <h1>Newton-Raphson </h1>
        <h1>Solver</h1>
                <form id="solver-form" action="/" method="post">
                <div class="prev">
                <p> Equation = ${equationInput} </p>
                <p>Initial Guess = ${initialGuess} </p>
                <p>The Solution correct to ${tol} digits is found by:</p>
                </div>
                <div class="text">
                <p>${resultsHTML}</p>
                <p>Converged to solution:${xVal.toFixed(tol)}</p>

                <center>
                    <input type="submit" class="btn" value="Back">
                </center>
                </div>
                </form>
        </b>
    </body>
    </html>
`);
});

app.post('/q3', (req, res) => {
    const equationInput = "e^x";
    const start = -1;
    const end = 1;
    const h = 0.1;
    let n = ((end - start) / h) + 1;
    let twoDArray = [
        ['x', 'y', 'diff:1', 'diff:2', 'diff:3', 'diff:4', 'diff:5', 'diff:6', 'diff:7', 'diff:8', 'diff:9', 'diff:10', 'diff:11', 'diff:12', 'diff:13', 'diff:14', 'diff:15', 'diff:16', 'diff:17', 'diff:18', 'diff:19', 'diff:20'],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    let i = 1;
    let c = parseFloat(start);

    console.log("Empty 2D Array:", twoDArray);

    for (i = 1; i <= n; i++) {
        twoDArray[i][0] = c.toFixed(4);
        c = c + h;
    }

    const equationFunction = math.parse(equationInput).compile();

    for (i = 1; i <= n; i++) {
        let fxval = equationFunction.evaluate({ x: parseFloat(twoDArray[i][0]) });
        twoDArray[i][1] = fxval;
    }

    let j;

    for (j = 2; j <= n; j++) {
        for (i = 1; i <= n - j + 1; i++) {
            let a = i;
            let b = j - 1;
            let a1 = i + 1;
            twoDArray[i][j] = (twoDArray[a1][b] - twoDArray[a][b]).toFixed(4);
        }
    }

    // Generating HTML table
    let htmlTable = '<table border="1">';
    for (i = 0; i <= n; i++) {
        htmlTable += '<tr>';
        for (j = 0; j <= 21; j++) {
            htmlTable += `<td>${twoDArray[i][j]}</td>`;
        }
        htmlTable += '</tr>';
    }
    htmlTable += '</table>';

    res.send(`<!DOCTYPE html>
        <html>
        <head>
            <title>Finite-Difference Table</title>
            <link rel="stylesheet" type="text/css" href="css/styles.css" />
        </head>
        <body background="resources/finite.jpeg">
            <b>
            <h1>Finite-Difference </h1>
            <h1>Table</h1>
                    <form id="solver-form" action="/" method="post">
                    <div class="prev">
                    <p> Equation = ${equationInput} </p>
                    <p>Interval starts from ${start} and ends at ${end} and includes the start and end points as well.</p>
                    <p>Interval size is: ${h}</p>
                    <p>The finite(forward) difference table is shown below:</p>
                    </div>
                    <div class="text1">
                    <p>${htmlTable}</p>
                    <center>
                        <input type="submit" class="btn1" value="Back">    
                    </center>
                    </div>
                    </form>
                   
            </b>
        </body>
        </html>`);
});

app.post('/q4', (req, res) => {
    const x1 = -1;
    const x2 = 1;
    let n = 6;
    let twoDArray = [
        ['x', 'y', 'diff:1', 'diff:2', 'diff:3', 'diff:4', 'diff:5'],
        [0.20, 1.6596, 0, 0, 0, 0, 0],
        [0.22, 1.6698, 0, 0, 0, 0, 0],
        [0.24, 1.6804, 0, 0, 0, 0, 0],
        [0.26, 1.6912, 0, 0, 0, 0, 0],
        [0.28, 1.7024, 0, 0, 0, 0, 0],
        [0.30, 1.7139, 0, 0, 0, 0, 0],
    ];


    let i;
    let j;

    for (j = 2; j <= n; j++) {
        for (i = 1; i <= n - j + 1; i++) {
            let a = i;
            let b = j - 1;
            let a1 = i + 1;
            twoDArray[i][j] = (twoDArray[a1][b] - twoDArray[a][b]).toFixed(4);
        }
    }

    let x0 = twoDArray[1][0];
    let xn = twoDArray[7][0];

    let p1= (x1-x0)/h;
    let p2= (x2-xn)/h;

    let fvalforward = x0 ;
    let fvalbackward = xn ;

    for(i=1; i<=5)
    {
        fvalforward +=  
    }

    // Generating HTML table
    let htmlTable = '<table border="1">';
    for (i = 0; i <= n; i++) {
        htmlTable += '<tr>';
        for (j = 0; j <= 6; j++) {
            htmlTable += `<td>${twoDArray[i][j]}</td>`;
        }
        htmlTable += '</tr>';
    }
    htmlTable += '</table>';

    console.log("2D Array:", twoDArray);

    res.send(`<!DOCTYPE html>
        <html>
        <head>
            <title>Finite-Difference Table</title>
            <link rel="stylesheet" type="text/css" href="css/styles.css" />
        </head>
        <body background="resources/mcsc.png">
            <b>
            <h1>Finite-Difference </h1>
            <h1>Table</h1>
                    <form id="solver-form" action="/" method="post">
                    <div class="prev">
                    <p>The finite difference table is shown below:</p>
                    </div>
                    <div class="text2">
                    <p>${htmlTable}</p>
                    <center>
                        <input type="submit" class="btn1" value="Back">    
                    </center>
                    </div>
                    </form>
                   
            </b>
        </body>
        </html>`);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});