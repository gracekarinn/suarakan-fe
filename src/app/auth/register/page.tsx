import AuthModule from "@/modules/AuthModule";
import RegisterSection from "@/modules/AuthModule/sections/RegisterSection";

export default function RegisterPage() {
  return (
    <AuthModule>
      <RegisterSection />
    </AuthModule>
  );
}