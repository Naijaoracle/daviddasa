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
  updateCategoryBar(bmi);
}

function updateCategoryBar(bmi) {
  const categoryBar = document.getElementById('categoryBar');

  // Clear previous categories
  categoryBar.innerHTML = '';

  // Define BMI categories and corresponding colors
  const categories = [
    { class: 'underweight', min: 0, max: 18.5 },
    { class: 'normal', min: 18.5, max: 24.9 },
    { class: 'overweight', min: 25, max: 29.9 },
    // Add more categories as needed
  ];

  for (const category of categories) {
    if (bmi >= category.min && bmi <= category.max) {
      categoryBar.innerHTML += `<div class="category ${category.class}" style="width: ${(bmi - category.min) / (category.max - category.min) * 100}%;"></div>`;
    }
  }
}