/**
 * Backup & Restore Admin UI
 * Admin interface for database backup and restore
 */

"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Upload,
  RefreshCw,
  Loader2,
  File,
  Calendar,
  HardDrive,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/api/client";

interface Backup {
  filename: string;
  size: string;
  createdAt: string;
  modifiedAt: string;
}

export default function BackupRestorePage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; data: Backup[] }>(
        "/admin/backup"
      );

      if (response.success) {
        setBackups(response.data);
      }
    } catch (error) {
      console.error("[Backup Error]", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    if (!confirm("Create a new database backup?")) return;

    try {
      setBackingUp(true);
      const response = await apiClient.post<{ success: boolean; message: string; data: { backupPath?: string } }>(
        "/admin/backup"
      );

      if (response.success) {
        alert("Backup created successfully!");
        await fetchBackups();
      } else {
        alert("Failed to create backup");
      }
    } catch (error) {
      console.error("[Backup Error]", error);
      alert("Failed to create backup");
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestore = async (backupFile: string) => {
    if (!confirm(`Are you sure you want to restore from ${backupFile}?\n\nThis will overwrite the current database. A backup of the current database will be created first.`)) return;

    try {
      setRestoring(true);
      const response = await apiClient.post<{ success: boolean; message: string }>(
        "/admin/backup/restore",
        { backupFile }
      );

      if (response.success) {
        alert("Database restored successfully! Please refresh the page.");
      } else {
        alert("Failed to restore database");
      }
    } catch (error) {
      console.error("[Restore Error]", error);
      alert("Failed to restore database");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Database Backup & Restore</h1>
          <p className="text-gray-600">Manage database backups and restore from previous backups</p>
        </div>
        <Button onClick={handleBackup} disabled={backingUp}>
          {backingUp ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Backup...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </>
          )}
        </Button>
      </div>

      {/* Warning */}
      <Card className="mb-6 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Important</h3>
              <p className="text-sm text-yellow-800">
                Always create a backup before restoring. Restoring will overwrite the current database.
                A backup of the current database will be created automatically before restore.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Backups</CardTitle>
            <Button variant="outline" size="sm" onClick={fetchBackups}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-gray-600">Loading backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">No backups found</p>
              <p className="text-sm text-gray-500 mb-4">Create your first backup to get started</p>
              <Button onClick={handleBackup}>
                <Download className="h-4 w-4 mr-2" />
                Create First Backup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <Card key={backup.filename}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <h3 className="font-semibold text-gray-900 truncate">
                            {backup.filename}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-8">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-4 w-4" />
                            {backup.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(backup.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          onClick={() => handleRestore(backup.filename)}
                          disabled={restoring}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          {restoring ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Restore
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Backup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Creating Backups</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Click &quot;Create Backup&quot; to create a timestamped backup of the database</li>
              <li>Backups are stored in the <code className="bg-gray-100 px-1 rounded">backups/</code> directory</li>
              <li>Backups are created automatically before database migrations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Restoring Backups</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Select a backup from the list and click &quot;Restore&quot;</li>
              <li>A backup of the current database will be created automatically before restore</li>
              <li>Restore will overwrite the current database with the selected backup</li>
              <li>Always test restores in a development environment first</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Manual Backup (Command Line)</h3>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <p className="mb-1">Windows (PowerShell):</p>
              <code className="text-gray-800">.\scripts\backup-db.ps1</code>
              <p className="mt-3 mb-1">Linux/Mac:</p>
              <code className="text-gray-800">bash scripts/backup-db.sh</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

