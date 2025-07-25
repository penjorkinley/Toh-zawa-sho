import FormContainer from "@/components/auth/FormContainer";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <FormContainer
      title="Kuzu Zangpo La!"
      subtitle="Log in to continue using Toh Zawa Sho."
    >
      <LoginForm />
    </FormContainer>
  );
}
