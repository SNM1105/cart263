class Flower {
  constructor(x, y, size, stemLength, petalColor) {
    // We write instructions to set up a Flower here
    // Position and size information
    this.x = x;
    this.y = y;
    this.size = size;
    this.stemLength = stemLength;
    this.stemThickness = 10;
    this.petalThickness = 8;
    this.flowerStemDiv = document.createElement("div");
    this.flowerPetalDiv = document.createElement("div");

    // Color information
    this.stemColor = {
      r: 50,
      g: 150,
      b: 50,
    };
    this.petalColor = petalColor;
    this.centreColor = {
      r: 50,
      g: 0,
      b: 0,
    };

    console.log(this);

    let self = this; // keep a copy of 'this'

    // Add event listener and the callback
    this.flowerStemDiv.addEventListener("click", function growStem(e) {
      console.log(e.target);
      console.log(self);
      self.stemLength += 10;
      self.flowerStemDiv.style.height = self.stemLength + "px";
      self.flowerStemDiv.style.top = self.y - self.stemLength + "px";
      self.flowerPetalDiv.style.top = self.y - self.stemLength - self.size / 2 + "px";
    });
  }

  // Render method
  renderFlower() {
    this.flowerStemDiv.classList.add("flower");
    this.flowerStemDiv.style.width = this.stemThickness + "px";
    this.flowerStemDiv.style.height = this.stemLength + "px";
    this.flowerStemDiv.style.background = `rgb(${this.stemColor.r},${this.stemColor.g},${this.stemColor.b})`;
    this.flowerStemDiv.style.left = this.x + "px";
    this.flowerStemDiv.style.top = this.y - this.stemLength + "px";
    // Add to the DOM
    document.getElementsByClassName("grass")[0].appendChild(this.flowerStemDiv);

    this.flowerPetalDiv.classList.add("petal");
    this.flowerPetalDiv.style.width = this.size + "px";
    this.flowerPetalDiv.style.height = this.size + "px";
    this.flowerPetalDiv.style.borderRadius = this.size + "px";
    this.flowerPetalDiv.style.background = `rgb(${this.centreColor.r},${this.centreColor.g},${this.centreColor.b})`;
    this.flowerPetalDiv.style.left = this.x - this.size / 2 + "px";
    this.flowerPetalDiv.style.top = this.y - this.stemLength - this.size / 2 + "px";
    this.flowerPetalDiv.style.borderWidth = this.petalThickness + "px";
    this.flowerPetalDiv.style.borderColor = `rgb(${this.petalColor.r},${this.petalColor.g},${this.petalColor.b})`;
    // Add to the DOM
    document.getElementsByClassName("grass")[0].appendChild(this.flowerPetalDiv);
  }
}

function createFlowers(garden) {
  for (let i = 0; i < garden.numFlowers; i++) {
    // Create variables for our arguments for clarity
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * 120;
    let size = Math.random() * 30 + 50;
    let stemLength = Math.random() * 50 + 50;
    let petalColor = {
      r: parseInt(Math.random() * 155) + 100,
      g: parseInt(Math.random() * 155) + 100,
      b: parseInt(Math.random() * 155) + 100,
    };

    // Create a new flower using the arguments
    let flower = new Flower(x, y, size, stemLength, petalColor);
    // Add the flower to the array of flowers
    garden.flowers.push(flower);
  }
}

// Export the Flower class and createFlowers function
export { Flower, createFlowers };