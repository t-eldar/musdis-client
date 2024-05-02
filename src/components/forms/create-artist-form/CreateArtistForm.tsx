import styles from "./CreateArtistForm.module.css";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { ImageUploader } from "@components/file-uploaders/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@components/ui/text-field";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@components/ui/button";

import Select from "@components/ui/select";
import { Modal } from "@components/ui/modal";
import { uploadFile } from "@services/files/mocks";
import { useAwait } from "@hooks/use-await";

const formSchema = z.object({
  name: z.string(),
  artistTypeSlug: z.string(),
  coverFile: z.object({
    id: z.string().uuid(),
    url: z.string().url(),
  }),
  userIds: z.string().uuid().array(),
});

type FormFields = z.infer<typeof formSchema>;
type CreateArtistFormProps = {
  artistTypes: { slug: string; name: string }[];
};
const CreateArtistForm = ({ artistTypes }: CreateArtistFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });
  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [cover, setCover] = useState<{ id: string; url: string }>();
  const {
    promise: uploadImage,
    isLoading: isUploadLoading,
    error: uploadError,
  } = useAwait<typeof uploadFile>(uploadFile);

  const {
    promise: invokeCreateArtist,
    isLoading: isCreateLoading,
    error: createError,
  } = useAwait();

  async function onSubmit(data: FormFields) {
    
  }

  async function handleImageSubmit(file: File) {
    const result = await uploadImage(file);
    if (result) {
      setCover({ id: result.id, url: result.url });
      setValue("coverFile", { id: result.id, url: result.url });
      setIsFileUploaderOpen(false);
    }
  }

  function checkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  return (
    <>
      <Modal open={isFileUploaderOpen} onOpenChange={setIsFileUploaderOpen}>
        <ImageUploader onSubmit={handleImageSubmit} />
      </Modal>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
        noValidate
      >
        <div className={styles["cover-container"]}>
          <AspectRatio.Root ratio={16 / 9}>
            {cover ? (
              <img
                className={styles.cover}
                src={cover.url}
                alt="Upload preview"
              />
            ) : (
              <Button onClick={() => setIsFileUploaderOpen(true)}>
                Add Cover
              </Button>
            )}
          </AspectRatio.Root>
        </div>
        <div className={styles["labeled-field"]}>
          <label htmlFor="artist-name">Name</label>
          <TextField
            id="artist-name"
            type="text"
            placeholder="Enter the name of the artist"
            {...register("name")}
          />
        </div>
        <div className={styles["labeled-field"]}>
          <Select.Root placeholder="Select artist type">
            {artistTypes.map((type) => (
              <Select.Item key={type.slug} value={type.slug}>
                {type.name}
              </Select.Item>
            ))}
          </Select.Root>
        </div>
        {errors.root && <span>{errors.root.message}</span>}
        <div>
          <Button disabled={!isSubmitting}>Create</Button>
        </div>
      </form>
    </>
  );
};

export default CreateArtistForm;
