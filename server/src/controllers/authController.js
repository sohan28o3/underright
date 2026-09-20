import jwt from "jsonwebtoken";
import { loginSchema } from "../validators/authValidator.js";

export function login(req, res) {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid login request.",
      errors: validation.error.flatten().fieldErrors,
    });
  }

  const { email, password } = validation.data;

  const demoEmail = process.env.DEMO_USER_EMAIL;
  const demoPassword = process.env.DEMO_USER_PASSWORD;
  const demoName =
    process.env.DEMO_USER_NAME || "Demo Underwriter";

  if (!demoEmail || !demoPassword) {
    return res.status(500).json({
      message: "Demo authentication is not configured.",
    });
  }

  const validEmail =
    email.toLowerCase() === demoEmail.toLowerCase();

  const validPassword =
    password === demoPassword;

  if (!validEmail || !validPassword) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    {
      email: demoEmail,
      name: demoName,
      role: "underwriter",
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "8h",
    },
  );

  return res.status(200).json({
    token,
    user: {
      name: demoName,
      email: demoEmail,
      role: "underwriter",
    },
  });
}