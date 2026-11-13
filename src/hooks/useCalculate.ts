import type { Friend } from "../types/types";
import { formatName } from "../utils/format";
import { isFriendList } from "../utils/storage";
import { usePersistedState } from "./usePersistedState";

// The table in progress: it must outlive a reload or the system closing the app in the background.
const FRIENDS_KEY = "quetedebo:draft:friends";

interface UseCalculate {
  friends: Friend[];
  addFriend: (name: string, expense: number, concept?: string) => void;
  updateFriend: (index: number, name: string, expense: number, concept?: string) => void;
  deleteFriend: (index: number) => void;
  reset: () => void;
}

export const useCalculate = (): UseCalculate => {
  const [friends, setFriends] = usePersistedState<Friend[]>(FRIENDS_KEY, [], isFriendList);

  const addFriend = (name: string, expense: number, concept = "") => {
    setFriends((prev) => {
      // Each friend keeps one colour for the whole session, even when others leave.
      const color = prev.length ? Math.max(...prev.map((friend) => friend.color ?? 0)) + 1 : 0;
      const newFriend: Friend = { name: formatName(name), expense, concept, color };
      return [...prev, newFriend];
    });
  };

  const updateFriend = (index: number, name: string, expense: number, concept = "") => {
    setFriends((prev) =>
      prev.map((friend, i) => (i === index ? { ...friend, name: formatName(name), expense, concept } : friend))
    );
  };

  const deleteFriend = (index: number) => {
    setFriends((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFriends([]);
  };

  return {
    friends,
    addFriend,
    updateFriend,
    deleteFriend,
    reset,
  };
};
