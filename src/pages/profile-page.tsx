import { useProfile } from "@/hooks";
import { useAppDispatch } from "@/hooks/rtk";
import { logout } from "@/store/auth-slice";

export function ProfilePage() {
  const { data } = useProfile();
  const dispatch = useAppDispatch();

  return (
    <div>
      <button onClick={() => dispatch(logout())}>Выйти</button>
    </div>
  );
}
