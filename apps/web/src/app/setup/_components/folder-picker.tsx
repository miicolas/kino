"use client";

import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Folder,
  FolderOpen,
  Loader2,
  RotateCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { orpcClient } from "@/orpc/client";

type FolderItem = { name: string; path: string };
type LoadStatus = "idle" | "loading" | "loaded" | "error";

const ROOT_ITEM = { name: "Média", path: "" };

type FolderBranchProps = {
  item: FolderItem;
  level: number;
  selectedPath: string | null;
  onSelect: (relativePath: string) => void;
};

function FolderBranch({
  item,
  level,
  selectedPath,
  onSelect,
}: FolderBranchProps) {
  const [isOpen, setIsOpen] = useState(item.path === ROOT_ITEM.path);
  const [entries, setEntries] = useState<FolderItem[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");

  const loadChildren = useCallback(async () => {
    setLoadStatus("loading");

    try {
      const result = await orpcClient.library.listDirectories({
        path: item.path,
      });
      setEntries(result.entries);
      setLoadStatus("loaded");
    } catch {
      setLoadStatus("error");
    }
  }, [item.path]);

  useEffect(() => {
    if (isOpen && loadStatus === "idle") {
      loadChildren();
    }
  }, [isOpen, loadChildren, loadStatus]);

  const canSelect = item.path !== ROOT_ITEM.path;
  const isSelected = item.path === selectedPath;

  return (
    <li>
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <div
          className="flex items-center gap-1"
          style={{ paddingInlineStart: `${level * 16}px` }}
        >
          <CollapsibleTrigger asChild>
            <Button
              aria-label={`${isOpen ? "Replier" : "Déplier"} ${item.name}`}
              className="size-11 shrink-0"
              size="icon"
              type="button"
              variant="ghost"
            >
              {loadStatus === "loading" ? (
                <Loader2
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
              ) : isOpen ? (
                <ChevronDown aria-hidden="true" />
              ) : (
                <ChevronRight aria-hidden="true" />
              )}
            </Button>
          </CollapsibleTrigger>
          <Button
            className="h-11 min-w-0 flex-1 justify-start px-2"
            disabled={!canSelect}
            onClick={() => onSelect(item.path)}
            type="button"
            variant={isSelected ? "secondary" : "ghost"}
          >
            {isOpen ? (
              <FolderOpen aria-hidden="true" />
            ) : (
              <Folder aria-hidden="true" />
            )}
            <span className="truncate">{item.name}</span>
          </Button>
        </div>

        <CollapsibleContent>
          {loadStatus === "error" && (
            <Alert
              className="my-1"
              style={{ marginInlineStart: `${(level + 1) * 16}px` }}
              variant="destructive"
            >
              <CircleAlert aria-hidden="true" />
              <AlertDescription className="flex flex-row items-center justify-between gap-2">
                Impossible de charger ce dossier.
                <Button
                  aria-label={`Réessayer de charger ${item.name}`}
                  className="size-11 shrink-0"
                  onClick={() => loadChildren()}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <RotateCw aria-hidden="true" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loadStatus === "loaded" && entries.length === 0 && (
            <p
              className="py-2 text-muted-foreground text-xs"
              style={{ paddingInlineStart: `${(level + 3) * 16}px` }}
            >
              Aucun sous-dossier
            </p>
          )}

          {entries.length > 0 && (
            <ul>
              {entries.map((entry) => (
                <FolderBranch
                  item={entry}
                  key={entry.path}
                  level={level + 1}
                  onSelect={onSelect}
                  selectedPath={selectedPath}
                />
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

type FolderPickerProps = {
  selectedPath: string | null;
  onSelect: (relativePath: string) => void;
};

export function FolderPicker({ selectedPath, onSelect }: FolderPickerProps) {
  return (
    <ScrollArea className="h-72 rounded-md border">
      <ul className="p-2">
        <FolderBranch
          item={ROOT_ITEM}
          level={0}
          onSelect={onSelect}
          selectedPath={selectedPath}
        />
      </ul>
    </ScrollArea>
  );
}
