import { formPersistenceService, type UserRole } from "@/services";
import { useCallback, useEffect, useRef } from "react";

export function useFormPersistence(
  role: UserRole,
  formData: Record<string, unknown>,
  enabled = true,
  debounceMs = 500,
) {
  const timeoutRef = useRef<number | null>(null);
  const previousDataRef = useRef<string>("");

  const saveFormData = useCallback(() => {
    if (!enabled) return;

    const currentDataStr = JSON.stringify(formData);

    if (currentDataStr === previousDataRef.current) {
      return;
    }

    previousDataRef.current = currentDataStr;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(async () => {
      try {
        const filteredData = Object.entries(formData).reduce(
          (acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, unknown>,
        );

        if (Object.keys(filteredData).length > 0) {
          await formPersistenceService.saveFormData(role, filteredData);
        }
      } catch (error) {
        console.error("Failed to auto-save form data:", error);
      }
    }, debounceMs);
  }, [role, formData, enabled, debounceMs]);

  const loadFormData = useCallback(async () => {
    try {
      const savedData = await formPersistenceService.getFormData(role);
      return savedData;
    } catch (error) {
      console.error("Failed to load saved form data:", error);
      return null;
    }
  }, [role]);

  const clearSavedData = useCallback(async () => {
    try {
      await formPersistenceService.clearFormData(role);
      previousDataRef.current = "";
    } catch (error) {
      console.error("Failed to clear saved form data:", error);
    }
  }, [role]);

  useEffect(() => {
    saveFormData();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveFormData]);

  return {
    loadFormData,
    clearSavedData,
  };
}
