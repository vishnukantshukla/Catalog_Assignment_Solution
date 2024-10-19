const fs = require('fs');
const path = require('path');

// const jsonFilePath = path.join(__dirname, 'test_case_1_polynomial_data.json');
const jsonFilePath = path.join(__dirname, 'test_case_2_polynomial_data_2.json');
function v1_decode_of_Value(value, base) {
    return parseInt(value, base); 
}

function v1_LagrangeInterpolation(v1_points) {
    let v1_res = 0;
    const k = v1_points.length;

    for (let i = 0; i < k; i++) {
        let xi = v1_points[i].x;
        let yi = v1_points[i].y;

        let li = 1; 
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = v1_points[j].x;
                li *= (0 - xj) / (xi - xj); 
            }
        }
        v1_res += yi * li; 
    }

    return v1_res;
}

function v1_extract_Points_From_Input(input) {
    const points = [];
    const { keys } = input;

    for (const key in input) {
        if (key !== "keys") {
            const x = parseInt(key); 
            const base = parseInt(input[key].base); 
            const value = input[key].value; 
            const y = v1_decode_of_Value(value, base);

            points.push({ x, y });
        }
    }

    return points;
}
function calculateSecret(input) {
    const points = v1_extract_Points_From_Input(input);
    const { k } = input.keys;
    if (points.length < k) {
        throw new Error('Not enough points provided');
    }
    const c = v1_LagrangeInterpolation(points.slice(0, k)); 

    return c;
}

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error in reading the JSON file: ', err);
        return;
    }

    try {

        const inputData = JSON.parse(data);
        const secret = calculateSecret(inputData);
        console.log("The constant term 'c' of the polynomial is :", secret );


    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
