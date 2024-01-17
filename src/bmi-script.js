function calculateBMI() {
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  if (isNaN(height) || isNaN(weight)) {
    document.getElementById("result").textContent = "Please enter valid height and weight.";
    return;
  }

  const bmi = weight / (height / 100) ** 2;
  document.getElementById("result").textContent = `Your BMI is ${bmi.toFixed(2)}.`;

  updateCategoryBar(bmi);
}

// Update the category bar based on the BMI value
function updateCategoryBar(bmi) {
  const categoryBar = document.getElementById("categoryBar");
  const pointer = document.querySelector("#categoryBar .pointer");
  const categories = [
    { class: "underweight", min: 0, max: 18.4 },
    { class: "mild", min: 18.5, max: 24.9 },
    { class: "normal", min: 25, max: 29.9 },
    { class: "overweight", min: 30, max: 34.9 },
    { class: "obese", min: 35, max: Infinity },
  ];

  let category = null;
  for (const cat of categories) {
    if (bmi >= cat.min && bmi <= cat.max) {
      category = cat;
      break;
    }
  }

  if (category) {
    const percentage = (bmi - category.min) / (category.max - category.min) * 100;
    pointer.style.left = `calc(${percentage}% - 5px)`;
    categoryBar.className = `category ${category.class}`;
  }
}

function calculateGradientColor(category, percentage) {
  // Define color stops for the gradient
  const colors = {
    underweight: '#e74c3c', // Red
    mild: '#f39c12',       // Orange
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
    'underweight', 'mild', 'normal', 'overweight', 'obese'
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
