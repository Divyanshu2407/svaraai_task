'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, createProject } from "@/services/projectService";
import { useAuth } from "@/context/AuthContext";
import { Project } from "@/types/project";
import Button from "@/components/Button";
import Card from "@/components/Card";

export default function Projects() {
  const { token } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects(token);
      setProjects(res.data || []);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!token) return;
    if (!name) return alert("Project name is required");
    setLoading(true);
    setError(null);
    try {
      await createProject(token, { name, description });
      setName("");
      setDescription("");
      await loadProjects();
    } catch (err) {
      setError("Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [token]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">
        Projects
      </h1>

      <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Project</h2>
        <input
          className="border border-gray-300 p-2 mb-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Project Name"
        />
        <input
          className="border border-gray-300 p-2 mb-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Project Description"
        />
        <div className="flex justify-end">
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {loading && projects.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <Card
              key={p._id}
              className="cursor-pointer hover:shadow-lg transition bg-gray-50 border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => router.push(`/projects/${p._id}`)}
              tabIndex={0}
              aria-label={`Project: ${p.name}`}
            >
              <h3 className="text-lg font-bold mb-1 text-gray-800">{p.name}</h3>
              <p className="mb-2 text-gray-600">{p.description}</p>
              <p className="text-xs text-gray-500">
                Created: {p.createdAt ? new Date(p.createdAt).toLocaleString() : "N/A"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
