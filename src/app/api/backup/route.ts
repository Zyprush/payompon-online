import { NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { dbAdmin } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const { dbName } = await req.json();

    if (!dbName) {
      return NextResponse.json(
        { error: "Database name is required" },
        { status: 400 }
      );
    }

    const backupBucket = "brgy-online.appspot.com"; 
    const backupPath = `backups/${dbName}-${Date.now()}.json`;

    const collections = await dbAdmin.listCollections();
    const backupData: Record<string, any> = {};

    for (const collection of collections) {
      const snapshot = await collection.get();
      backupData[collection.id] = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
    }

    const file = admin.storage().bucket(backupBucket).file(backupPath);
    
    try {
      await file.save(JSON.stringify(backupData), {
        contentType: "application/json",
      });
    } catch (uploadError) {
      console.error("Error saving file to bucket:", uploadError);
      return NextResponse.json(
        { error: "Failed to save file to storage" },
        { status: 500 }
      );
    }

    try {
      const [fileContents] = await file.download();
      return new Response(fileContents, {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${backupPath}"`,
        },
      });
    } catch (downloadError) {
      console.error("Error downloading file from bucket:", downloadError);
      return NextResponse.json(
        { error: "Failed to download file from storage" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error creating backup:", error);
    return NextResponse.json(
      { error: "Failed to create backup" },
      { status: 500 }
    );
  }
}
