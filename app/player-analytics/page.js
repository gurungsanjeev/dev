"use client";

import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue, update, remove } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { showToast } from "@/components/ui/toast";
import { FaTrophy, FaTrophyAlt, FaAward, FaUser, FaClock, FaChartLine, FaPlus, FaTrash } from "react-icons/fa";

const PlayerAnalytics = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    player_name: '',
    total_points: '',
    time_taken: ''
  });

  // Fetch players from Firebase
  useEffect(() => {
    const playersRef = ref(db, "players");
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        // Sort by rank
        const sortedPlayers = playersArray.sort((a, b) => a.rank - b.rank);
        setPlayers(sortedPlayers);
      } else {
        setPlayers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const recalculateRanks = (playersList) => {
    // Sort by total_points (descending) and time_taken (ascending)
    const sorted = [...playersList].sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points;
      }
      return a.time_taken - b.time_taken;
    });
    
    // Update ranks
    return sorted.map((player, index) => ({
      ...player,
      rank: index + 1
    }));
  };

  const updatePlayerRanks = async (playersList) => {
    try {
      const playersRef = ref(db, "players");
      // Remove all existing players first
      await remove(playersRef);
      
      // Add players with updated ranks
      for (const player of playersList) {
        const { id, ...playerData } = player;
        await push(playersRef, playerData);
      }
    } catch (error) {
      console.error("Error updating ranks:", error);
      showToast("Error updating player ranks", "error");
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    
    if (!newPlayer.player_name || !newPlayer.total_points || !newPlayer.time_taken) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      // Generate player ID
      const player_id = Math.random().toString(36).substring(2, 10);
      
      const playerData = {
        player_id,
        player_name: newPlayer.player_name,
        total_points: parseInt(newPlayer.total_points),
        time_taken: parseFloat(newPlayer.time_taken),
        rank: players.length + 1
      };

      const playersRef = ref(db, "players");
      await push(playersRef, playerData);
      
      showToast("Player added successfully!");
      setIsAddDialogOpen(false);
      setNewPlayer({ player_name: '', total_points: '', time_taken: '' });
    } catch (error) {
      console.error("Error adding player:", error);
      showToast("Error adding player", "error");
    }
  };

  const handleEditPlayer = async (e) => {
    e.preventDefault();
    
    if (!editingPlayer.player_name || !editingPlayer.total_points || !editingPlayer.time_taken) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      const updatedPlayer = {
        ...editingPlayer,
        total_points: parseInt(editingPlayer.total_points),
        time_taken: parseFloat(editingPlayer.time_taken)
      };

      const playerRef = ref(db, `players/${editingPlayer.id}`);
      const { id, ...playerData } = updatedPlayer;
      await update(playerRef, playerData);
      
      showToast("Player updated successfully!");
      setIsEditDialogOpen(false);
      setEditingPlayer(null);
    } catch (error) {
      console.error("Error updating player:", error);
      showToast("Error updating player", "error");
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm("Are you sure you want to delete this player?")) {
      return;
    }

    try {
      const playerRef = ref(db, `players/${playerId}`);
      await remove(playerRef);
      showToast("Player deleted successfully!");
    } catch (error) {
      console.error("Error deleting player:", error);
      showToast("Error deleting player", "error");
    }
  };

  const openEditDialog = (player) => {
    setEditingPlayer({
      ...player,
      total_points: player.total_points.toString(),
      time_taken: player.time_taken.toString()
    });
    setIsEditDialogOpen(true);
  };

  const stats = {
    totalPlayers: players.length,
    avgPoints: players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.total_points, 0) / players.length) : 0,
    avgTime: players.length > 0 ? (players.reduce((sum, p) => sum + p.time_taken, 0) / players.length).toFixed(1) : 0,
    topScore: players.length > 0 ? Math.max(...players.map(p => p.total_points)) : 0
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-gray-600";
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm rounded-lg mb-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <FaTrophyAlt className="text-yellow-500" />
              Player Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track performance and rankings in real-time</p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FaPlus className="mr-2 h-4 w-4" /> Add Player
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Player</DialogTitle>
                  <DialogDescription>
                    Enter player details to add them to the leaderboard.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPlayer}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="player_name">Player Name</Label>
                      <Input
                        id="player_name"
                        placeholder="Enter player name"
                        value={newPlayer.player_name}
                        onChange={(e) => setNewPlayer({ ...newPlayer, player_name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="total_points">Total Points</Label>
                      <Input
                        id="total_points"
                        type="number"
                        placeholder="Enter points"
                        value={newPlayer.total_points}
                        onChange={(e) => setNewPlayer({ ...newPlayer, total_points: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time_taken">Time Taken (seconds)</Label>
                      <Input
                        id="time_taken"
                        type="number"
                        step="0.1"
                        placeholder="Enter time in seconds"
                        value={newPlayer.time_taken}
                        onChange={(e) => setNewPlayer({ ...newPlayer, time_taken: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Player</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Players</CardTitle>
              <FaUser className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPlayers}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Score</CardTitle>
              <FaTrophy className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.topScore.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Points</CardTitle>
              <FaChartLine className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgPoints.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Time</CardTitle>
              <FaClock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgTime}s</div>
            </CardContent>
          </Card>
        </div>

        {/* Players Table */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FaAward className="text-yellow-500" />
              Leaderboard
            </CardTitle>
            <CardDescription>Current player rankings based on performance</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : players.length === 0 ? (
              <div className="text-center py-12">
                <FaTrophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg mb-4">No players yet</p>
                <p className="text-gray-500">Add your first player to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">Rank</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Player ID</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Player Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Total Points</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Time Taken</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr 
                        key={player.id} 
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <span className={`text-2xl font-bold ${getRankColor(player.rank)}`}>
                            {getRankBadge(player.rank)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-mono text-gray-600">{player.player_id}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900">{player.player_name}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-green-600 font-bold">{player.total_points.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-700">{player.time_taken}s</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(player)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePlayer(player.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
              <DialogDescription>
                Update player details.
              </DialogDescription>
            </DialogHeader>
            {editingPlayer && (
              <form onSubmit={handleEditPlayer}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_player_name">Player Name</Label>
                    <Input
                      id="edit_player_name"
                      placeholder="Enter player name"
                      value={editingPlayer.player_name}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, player_name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_total_points">Total Points</Label>
                    <Input
                      id="edit_total_points"
                      type="number"
                      placeholder="Enter points"
                      value={editingPlayer.total_points}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, total_points: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_time_taken">Time Taken (seconds)</Label>
                    <Input
                      id="edit_time_taken"
                      type="number"
                      step="0.1"
                      placeholder="Enter time in seconds"
                      value={editingPlayer.time_taken}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, time_taken: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Player</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PlayerAnalytics;