import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const OAuth = () => {

  const queryClient = useQueryClient(); 

  const {mutate: handleClick, isPending} = useMutation({
    mutationFn: async () => {
      try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
  
        const result = await signInWithPopup(auth, provider);

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL
          })
        });

        const data = await res.json();
      } catch (error) {
        console.log("Error with google OAuth", error.message);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    }
  })

  return (
    <button onClick={handleClick} type='button' className='bg-red-700 p-2 rounded-md text-lg text-white capitalize hover:bg-red-800 disabled:opacity-80 transition duration-200'>
      Continue with google
    </button>
  )
}

export default OAuth
