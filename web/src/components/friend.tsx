import { useProvider } from "@/context/FeedContext";
import api from "@/lib/api";
import { IFriend } from "@/types/Friend";
import Cookie from "js-cookie";
import { CirclePlus, CircleX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Friend({
  friend,
  isFriend = false,
}: {
  friend: IFriend;
  isFriend?: boolean;
}) {
  const { getFriends, getSugestions } = useProvider();

  const router = useRouter();

  const handleRemoveFriend = async () => {
    const token = Cookie.get("token");
    await api.delete(`/friend/remove/${friend.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    getFriends();
    getSugestions();

    return toast.success(`Você removeu ${friend.name.split(" ")[0]}`);
  };

  const handleAddFriend = async () => {
    const token = Cookie.get("token");
    await api.post(`/friend/add`, {
      id: friend.id,
      userName: friend.name,
      avatarUrl: friend.avatarUrl,
    });

    getFriends();
    getSugestions();

    return toast.success(`Vocẽ adicionou ${friend.name.split(" ")[0]}`);
  };

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-xl transition-colors hover:bg-zinc-800">
      <div className="flex items-center gap-3">
        <Image
          src={friend.avatarUrl}
          width={60}
          height={60}
          draggable={false}
          alt="avatar-image"
          onClick={() => {
            router.push(`/profile/${friend.userId}`);
          }}
          className="size-12 rounded-full hover:outline outline-2 outline-primary cursor-pointer"
        />

        <p className="max-w-[140px] text-zinc-400 text-base">{friend.name}</p>
      </div>

      {isFriend ? (
        <CircleX
          onClick={handleRemoveFriend}
          className="size-6 cursor-pointer transition-colors text-zinc-500 hover:hover:text-red-600"
        />
      ) : (
        <CirclePlus
          onClick={handleAddFriend}
          className="size-8 p-1 cursor-pointer text-zinc-500 transition-colors hover:hover:text-primary"
        />
      )}
    </div>
  );
}
