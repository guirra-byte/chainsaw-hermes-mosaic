import { prisma } from "../_shared/prisma/prisma";

const revokeInUseCredential = async (id: number) => {
  await prisma.openAiCredentials.update({
    where: { id },
    data: { inUse: false },
  });
};

const getOtherCredential = async (
  tagUse: "TRANSCRIPTION" | "FINE_TUNE",
  inUse: boolean
) => {
  return await prisma.openAiCredentials.findFirst({
    where: { inUse, tagUse },
  });
};

export const openAiCredentialsSwitcher = async (
  tag: "TRANSCRIPTION" | "FINE_TUNE",
  id?: number
) => {
  const openAiCredentials = await prisma.openAiCredentials.findMany({
    where: { tagUse: tag },
  });

  if (!openAiCredentials) {
    throw new Error("Cannot find credentials!");
  }

  const inUseCredentials = openAiCredentials.filter(
    (credentials) => credentials.inUse
  );

  if (inUseCredentials.length > 1) {
    throw new Error("Multiple credentials are in use at same time.");
  }

  if (id) {
    let targetCredentialId;
    const inUse = inUseCredentials[0];

    const credentialById = openAiCredentials.find(
      (credential) => credential.id === id
    );

    if (credentialById) {
      if (inUse && credentialById.inUse && credentialById.id === inUse.id) {
        const otherCredential = await getOtherCredential(tag, false);
        await revokeInUseCredential(inUse.id);

        if (otherCredential) {
          targetCredentialId = otherCredential.id;
        } else throw new Error("Cannot find other credential!");
      } else targetCredentialId = id;

      await prisma.openAiCredentials.update({
        where: { id: targetCredentialId },
        data: { inUse: true },
      });

      return id;
    }

    const randomCredential = await getOtherCredential(tag, false);
    if (!randomCredential) {
      throw new Error("Cannot find credential!");
    }

    if (inUseCredentials[0]) {
      await revokeInUseCredential(inUseCredentials[0].id);
    }

    await prisma.openAiCredentials.update({
      where: { id: randomCredential.id },
      data: { inUse: true },
    });

    return randomCredential.id;
  }
};
