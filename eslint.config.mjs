import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // Reglas nuevas del React Compiler (llegaron con eslint-config-next 16).
    // El código es anterior a ellas y funciona en producción; las dejamos como
    // avisos (visibles) para no bloquear el CI por deuda previa. El gate sigue
    // fallando ante errores nuevos reales (sintaxis, vars sin definir, etc.).
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
