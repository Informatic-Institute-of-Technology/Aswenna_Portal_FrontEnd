type FormDataValue = string | number | boolean | File | Blob | Date | null | undefined;
type NestedObject = { [key: string]: FormDataValue | NestedObject | FormDataValue[] | NestedObject[] };

export const appendObjectToFormData = (
  formData: FormData,
  data: NestedObject,
  parentKey: string = ''
): void => {
  Object.keys(data).forEach(key => {
    const value = data[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) {
      return;
    } else if (value instanceof File) {
      formData.append(formKey, value);
    } else if (typeof Blob !== 'undefined' && value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File || (typeof Blob !== 'undefined' && item instanceof Blob)) {
          formData.append(`${formKey}[]`, item);
        } else if (typeof item === 'object' && item !== null) {
          appendObjectToFormData(formData, item as NestedObject, `${formKey}[${index}]`);
        } else {
          formData.append(`${formKey}[]`, String(item));
        }
      });
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      appendObjectToFormData(formData, value as NestedObject, formKey);
    } else {
      formData.append(formKey, String(value));
    }
  });
};


export const createRegistrationFormData = (
  data: NestedObject,
  fileFields?: Record<string, File | null>
): FormData => {
  const formData = new FormData();

  appendObjectToFormData(formData, data);

  if (fileFields) {
    Object.entries(fileFields).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });
  }

  return formData;
};

export const logFormData = (formData: FormData, label: string = 'FormData'): void => {
  console.log(`=== ${label} ===`);
  let totalSize = 0;

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
      totalSize += value.size;
    } else if (typeof value === 'object' && value && 'size' in value) {
      console.log(`${key}: [Blob] (${(value as Blob).size} bytes)`);
      totalSize += (value as Blob).size;
    } else {
      console.log(`${key}: ${value}`);
      totalSize += String(value).length;
    }
  }

  console.log(`Total approximate size: ${totalSize} bytes (${(totalSize / 1024).toFixed(2)} KB)`);
};


export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};
