export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password) {
  return password.length >= 8;
}

export function validateRequired(value) {
  return String(value ?? "").trim().length > 0;
}

export function validatePhone(phone) {
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
}

export function validateRegistration(values) {
  const errors = {};

  if (!validateRequired(values.name)) {
    errors.name = "Name is required";
  }

  if (!validateEmail(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!validatePassword(values.password)) {
    errors.password = "Password must contain at least 8 characters";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateCheckout(values) {
  const errors = {};

  ["name", "address", "city", "state", "pincode"].forEach((key) => {
    if (!validateRequired(values[key])) {
      errors[key] = "This field is required";
    }
  });

  if (!validatePhone(values.phone)) {
    errors.phone = "Enter a valid 10-digit phone number";
  }

  if (!/^\d{6}$/.test(values.pincode)) {
    errors.pincode = "Enter a valid 6-digit PIN code";
  }

  if (!validateEmail(values.email)) {
    errors.email = "Enter a valid email address";
  }

  return errors;
}
