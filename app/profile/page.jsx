"use client";

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();

  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompts/${post._id}`, { method: "DELETE" });

        setPosts((prev) => prev.filter((p) => p._id !== post._id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchPosts = async () => {
    const response = await fetch(
      `/api/users/${userId || session?.user.id}/posts`
    );
    const data = await response.json();

    setPosts(data);
  };

  const fetchUser = async () => {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    setUser(userData);
  };

  useEffect(() => {
    if (!userId && session?.user.id) fetchPosts();
  }, [session]);

  useEffect(() => {
    if (userId) {
      fetchPosts();
      fetchUser();
    } else setUser(undefined);
  }, [userId]);

  return (
    <Profile
      name={user?.username || "my"}
      desc={`Welcome to ${user?.email || "your personalized"} profile page`}
      data={posts}
      {...{ handleDelete, handleEdit }}
    />
  );
}

export default ProfilePage;
