import AuthModule from "@/modules/AuthModule";
import LoginSection from "@/modules/AuthModule/sections/LoginSection";

export default function LoginPage() {
  return (
    <AuthModule>
      <LoginSection />
    </AuthModule>
  );
}
