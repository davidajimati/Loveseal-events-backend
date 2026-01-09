import {z} from "zod";

const emailZod = z.object({
    email: z.email("invalid email").trim().lowercase()
})

export {
    emailZod
}