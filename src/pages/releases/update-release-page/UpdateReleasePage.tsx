import UpdateReleaseForm from "@components/forms/releases/update-release-form";
import styles from "./UpdateReleasePage.module.css";

import * as Tabs from "@radix-ui/react-tabs";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "@hooks/use-fetch";
import { getRelease } from "@services/releases";
import { useAuthStore } from "@stores/auth-store";
import { useEffect, useState } from "react";
import useAlert from "@hooks/use-alert";
import { UpdatableTrackList } from "@components/lists/updatable-track-list";

const UpdateReleasePage = () => {
  const params = useParams<{ releaseSlug: string }>();
  const releaseId = params.releaseSlug;

  const navigate = useNavigate();
  const alert = useAlert();

  const user = useAuthStore((s) => s.user);

  const [changed, setChanged] = useState(false);

  const { data: release } = useFetch(
    async (signal) => {
      return await getRelease(releaseId || "", signal);
    },
    [releaseId, changed]
  );

  useEffect(() => {
    if (!release) {
      return;
    }

    if (user === null || (user && user.id !== release.creatorId)) {
      navigate("/", { replace: true });
      alert({
        variant: "warning",
        title: "Unauthorized.",
        message: "You don't have permission to access this page.",
      });
    }
  }, [user, release, alert, navigate]);

  function toggleChanged() {
    setChanged((p) => !p);
  }

  return (
    <div className={styles.container}>
      <Tabs.Root defaultValue="release">
        <div>
          <Tabs.List
            className={styles["tabs-list"]}
            aria-label="Manage your account"
          >
            <Tabs.Trigger className={styles["tabs-trigger"]} value="release">
              Release
            </Tabs.Trigger>
            <Tabs.Trigger className={styles["tabs-trigger"]} value="tracks">
              Tracks
            </Tabs.Trigger>
          </Tabs.List>
          <div className={styles["form-container"]}>
            <Tabs.Content value="release">
              {release && (
                <UpdateReleaseForm
                  onUpdated={() =>
                    navigate(`/releases/${release.id}`, { replace: true })
                  }
                  onDeleted={() => navigate("/profile", { replace: true })}
                  release={{
                    ...release,
                    releaseTypeSlug: release.releaseType.slug,
                  }}
                />
              )}
            </Tabs.Content>
            <Tabs.Content value="tracks">
              {release && (
                <UpdatableTrackList
                  onChanged={toggleChanged}
                  releaseId={release.id}
                  tracks={release.tracks}
                />
              )}
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default UpdateReleasePage;
