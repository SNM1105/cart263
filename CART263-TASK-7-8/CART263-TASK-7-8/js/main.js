    window.onload = async function () {
        console.log("task 7-8");
        try {
            const response = await fetch('data/iris.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            // Object properties: sepalLength, sepalWidth, petalLength, petalWidth, species

            let possibleColor = ["#5d3fd3", "#a73fd3", "#d33fb5", "#d35d3f", "#d3a73f"];
            const irisesWithColors = data.map(iris => {
                return {
                    ...iris,
                    color: possibleColor[Math.floor(Math.random() * possibleColor.length)]
                };
            });

            console.log(irisesWithColors);

            const filteredIrises = irisesWithColors.filter(iris => iris.sepalWidth < 4);
            console.log(filteredIrises);

            // Calculate the average petalLength using reduce
            const totalPetalLength = irisesWithColors.reduce((sum, iris) => sum + iris.petalLength, 0);
            const averagePetalLength = totalPetalLength / irisesWithColors.length;

            console.log(`Average Petal Length: ${averagePetalLength}`);

            // Find an iris object with petalWidth > 1.0
            const irisWithLargePetalWidth = irisesWithColors.find(iris => iris.petalWidth > 1.0);
            console.log('Iris with petalWidth > 1.0:', irisWithLargePetalWidth);

            // Check if any iris object has a petalLength > 10
            const hasLargePetalLength = irisesWithColors.some(iris => iris.petalLength > 10);
            console.log(`Is there any iris with petalLength > 10? ${hasLargePetalLength}`);
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }