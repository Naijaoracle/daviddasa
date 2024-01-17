function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  // Calculate BMI
  const bmi = weight / ((height / 100) ** 2);

  // Display BMI result
  const resultElement = document.getElementById("result");
  resultElement.textContent = `Your BMI is ${bmi.toFixed(2)}.`;

  // Determine BMI classification
  let classification;
  if (bmi < 18.5) {
    classification = "Underweight";
  } else if (bmi < 25) {
    classification = "Normal weight";
  } else if (bmi < 30) {
    classification = "Overweight";
  } else {
    classification = "Obese";
  }

  // Update the note with BMI classification
  const noteElement = document.getElementById("result");
  noteElement.textContent = `Which is classified as ${classification}.`;
  updateCategoryBar(bmi);
}

window.onload = function() {
  const categoryBar = document.getElementById("categoryBar");
  const pointer = document.querySelector("#categoryBar .pointer");

  // Set the pointer to the middle of the category bar
  pointer.style.left = `${categoryBar.offsetWidth / 2}px`;
};

function updateCategoryBar(bmi) {
  const categoryBar = document.getElementById("categoryBar");
  const pointer = document.querySelector("#categoryBar .pointer");
  const categories = [
    { class: "underweight", min: 0, max: 18.499 },
    { class: "normal", min: 18.5, max: 24.999 },
    { class: "overweight", min: 25, max: 29.999 },
    { class: "obese", min: 30, max: Infinity },
  ];

  let categoryIndex = -1;
  for (let i = 0; i < categories.length; i++) {
    if (bmi >= categories[i].min && bmi <= categories[i].max) {
      categoryIndex = i;
      break;
    }
  }

  if (categoryIndex !== -1) {
    const categoryBarWidth = categoryBar.offsetWidth;
    const categoryWidth = categoryBarWidth / 4; // 25% width for each category
    const categoryOffset = categoryIndex * categoryWidth; // Offset for the current category

    // Adjusted pointer position within the category:
    const pointerPosition =
      categoryOffset +
      ((bmi - categories[categoryIndex].min) / (categories[categoryIndex].max - categories[categoryIndex].min)) * categoryWidth;

    pointer.style.left = `${pointerPosition}px`;
    const categoryElements = categoryBar.children;
    for (let i = 0; i < categoryElements.length; i++) {
      if (i === categoryIndex) {
        categoryElements[i].classList.add("active");
      } else {
        categoryElements[i].classList.remove("active");
      }
    }
  }
}

function calculateGradientColor(category, percentage) {
  // Define color stops for the gradient
  const colors = {
    underweight: '#e74c3c', // Red
    normal: '#2ecc71',     // Green
    overweight: '#f39c12', // Orange
    obese: '#e74c3c',      // Red
  };

  // Calculate a gradient color based on the percentage
  const startColor = colors[category.class];
  const endColor = colors[getNextCategory(category).class];
  const gradientColor = interpolateColors(startColor, endColor, percentage / 100);
  
  return gradientColor;
}

function getNextCategory(category) {
  // Get the next category in the list for gradient calculation
  const categories = [
    'underweight', 'normal', 'overweight', 'obese'
  ];

  const currentIndex = categories.indexOf(category.class);
  const nextIndex = (currentIndex + 1) % categories.length;

  return { class: categories[nextIndex] };
}

function interpolateColors(startColor, endColor, percentage) {
  // Interpolate between two colors based on a percentage
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  const interpolatedRGB = {
    r: Math.round(startRGB.r + percentage * (endRGB.r - startRGB.r)),
    g: Math.round(startRGB.g + percentage * (endRGB.g - startRGB.g)),
    b: Math.round(startRGB.b + percentage * (endRGB.b - startRGB.b)),
  };

  return rgbToHex(interpolatedRGB.r, interpolatedRGB.g, interpolatedRGB.b);
}

function hexToRgb(hex) {
  // Convert hex color to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r, g, b) {
  // Convert RGB color to hex
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
