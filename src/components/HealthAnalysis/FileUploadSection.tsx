import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadSectionProps {
  onFileChange: (files: File[]) => void;
}

export function FileUploadSection({ onFileChange }: FileUploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFileChange(filesArray);
    } else {
      onFileChange([]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">Upload Lab Results (Optional)</Label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              JPG, JPEG, or PNG (MAX. 10MB per file)
            </p>
          </div>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>
    </div>
  );
}
