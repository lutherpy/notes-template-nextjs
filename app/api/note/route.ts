"use server";

import { db } from "@/db/drizzle";
import { Note, note } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getNotes() {
    try {
        const allNotes = await db.select().from(note);
        return allNotes;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function createNote(noteData: { title: string; content: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user.id;

    if (!userId) {
        throw new Error("Unauthorized: No user session found.");
    }

    try {
        await db.insert(note).values({
            ...noteData,
            userId,
        });
    } catch (error) {
        console.error(error);
        return { error: "Failed to create note" };
    }
}



export async function updateNote(noteData: Omit<Note, "createdAt" | "updatedAt">) {
    try {
        await db.update(note).set(noteData).where(eq(note.id, noteData.id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to update note" };
    }
}

export async function deleteNote(id: string) {
    try {
        await db.delete(note).where(eq(note.id, id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete note" };
    }
}
