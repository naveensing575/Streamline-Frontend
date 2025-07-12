import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/features/useAuth";
import RegisterForm from "@/components/RegisterForm";
import { toast } from "sonner";

export default function Register() {
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const onRegister = async (name: string, email: string, password: string) => {
    try {
      const res = await registerUser({ name, email, password }).unwrap();
      localStorage.setItem("token", res.token);
      navigate("/");
      toast.success(`Welcome ${name}! 🎉`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm onSubmit={onRegister} />
    </div>
  );
}
