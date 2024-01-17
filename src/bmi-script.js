//Define BMI categories
const categories = [
  { class: 'underweight', min: 0, max: 17.0 },
  { class: 'mild', min: 17.0, max: 18.4 },
  { class: 'normal', min: 18.5, max: 24.9 },
  { class: 'overweight', min: 25, max: 29.9 },
  { class: 'obese', min: 30.0, max: Infinity },
];

function calculateBMI() {
  const height = document.getElementById("height").value / 100;
  const weight = document.getElementById("weight").value;
  const bmi = weight / (height * height);
  const result = document.getElementById("result");

  if (bmi < 18.5) {
    result.innerHTML = `Your BMI is ${bmi.toFixed(
      1
    )}, which means you are underweight.`;
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    result.innerHTML = `Your BMI is ${bmi.toFixed(
      1
    )}, which means you have a normal weight.`;
  } else if (bmi >= 25 && bmi <= 29.9) {
    result.innerHTML = `Your BMI is ${bmi.toFixed(
      1
    )}, which means you are overweight.`;
  } else {
    result.innerHTML = `Your BMI is ${bmi.toFixed(
      1
    )}, which means you are obese.`;
  }
  
  // Update the BMI category display
  updateCategoryBar(height, bmi);
}

function updateCategoryBar(height, bmi) {
  const categoryBar = document.getElementById('categoryBar');
  const pointer = document.querySelector('.pointer');

  let gradient = ''; // Accumulate gradient colors
  let pointerPosition = 0;

  for (const category of categories) {
    const percentage = (category.max - category.min) / height * 100;

    if (bmi >= category.min && bmi <= category.max) {
      pointerPosition = (bmi - category.min) / (category.max - category.min) * percentage;
    }

    gradient += `${percentage}% ${calculateGradientColor(category, 0)}, `;
  }

  // Remove trailing comma and space
  gradient = gradient.slice(0, -2);

  categoryBar.style.background = `linear-gradient(to right, ${gradient})`;
  pointer.style.left = `${pointerPosition}%`;
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
