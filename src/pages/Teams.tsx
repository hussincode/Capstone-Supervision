import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Edit, Trash2, X, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Teams = () => {
  const { user } = useAuth();
  const { teams, addTeam, updateTeam, deleteTeam } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTeam, setNewTeam] = useState({
    name: '',
    members: [''],
    leaderId: user?.id || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTeam({ ...currentTeam, [name]: value });
  };

  const handleMemberChange = (index: number, value: string) => {
    const updatedMembers = [...newTeam.members];
    updatedMembers[index] = value;
    setNewTeam({ ...newTeam, members: updatedMembers });
  };

  const handleEditMemberChange = (index: number, value: string) => {
    const updatedMembers = [...currentTeam.members];
    updatedMembers[index] = value;
    setCurrentTeam({ ...currentTeam, members: updatedMembers });
  };

  const addMemberField = () => {
    setNewTeam({ ...newTeam, members: [...newTeam.members, ''] });
  };

  const addEditMemberField = () => {
    setCurrentTeam({ ...currentTeam, members: [...currentTeam.members, ''] });
  };

  const removeMemberField = (index: number) => {
    const updatedMembers = [...newTeam.members];
    updatedMembers.splice(index, 1);
    setNewTeam({ ...newTeam, members: updatedMembers });
  };

  const removeEditMemberField = (index: number) => {
    const updatedMembers = [...currentTeam.members];
    updatedMembers.splice(index, 1);
    setCurrentTeam({ ...currentTeam, members: updatedMembers });
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty member fields
    const filteredMembers = newTeam.members.filter(member => member.trim() !== '');
    
    if (newTeam.name.trim() === '') {
      toast.error('Team name is required');
      return;
    }
    
    if (filteredMembers.length === 0) {
      toast.error('At least one team member is required');
      return;
    }
    
    addTeam({
      name: newTeam.name,
      members: filteredMembers,
      leaderId: user?.id || '',
    });
    
    setNewTeam({
      name: '',
      members: [''],
      leaderId: user?.id || '',
    });
    
    setIsAddModalOpen(false);
    toast.success('Team added successfully');
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTeam) return;
    
    // Filter out empty member fields
    const filteredMembers = currentTeam.members.filter((member: string) => member.trim() !== '');
    
    if (currentTeam.name.trim() === '') {
      toast.error('Team name is required');
      return;
    }
    
    if (filteredMembers.length === 0) {
      toast.error('At least one team member is required');
      return;
    }
    
    updateTeam(currentTeam.id, {
      name: currentTeam.name,
      members: filteredMembers,
    });
    
    setIsEditModalOpen(false);
    toast.success('Team updated successfully');
  };

  const handleDeleteTeam = () => {
    if (!currentTeam) return;
    
    deleteTeam(currentTeam.id);
    setIsDeleteModalOpen(false);
    toast.success('Team deleted successfully');
  };

  const openEditModal = (team: any) => {
    setCurrentTeam(team);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (team: any) => {
    setCurrentTeam(team);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Teams</h1>
          <p className="text-gray-600">Manage your project teams</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} className="mr-1" /> Add Team
          </motion.button>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="p-5 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{team.members.length} Members</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                      onClick={() => openEditModal(team)}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                      onClick={() => openDeleteModal(team)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members:</h4>
                <ul className="space-y-3">
                  {team.members.map((member: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <div className="bg-red-100 text-red-600 p-1.5 rounded-full mr-2">
                        <Users size={16} />
                      </div>
                      <span className="text-sm text-gray-700">{member}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500">
                Created on {new Date(team.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="flex justify-center mb-4">
            <Users size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Teams Found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'No teams match your search criteria.' : 'You haven\'t created any teams yet.'}
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} className="inline mr-1" /> Create Team
          </button>
        </div>
      )}

      {/* Add Team Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Add New Team</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddTeam} className="p-5">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    placeholder="Enter team name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                  {newTeam.members.map((member, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => handleMemberChange(index, e.target.value)}
                        placeholder="Enter member name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      {newTeam.members.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-red-600"
                          onClick={() => removeMemberField(index)}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700 flex items-center mt-2"
                    onClick={addMemberField}
                  >
                    <Plus size={16} className="mr-1" /> Add Another Member
                  </button>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Team Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Edit Team</h3>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateTeam} className="p-5">
                <div className="mb-4">
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={currentTeam.name}
                    onChange={handleEditInputChange}
                    placeholder="Enter team name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                  {currentTeam.members.map((member: string, index: number) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => handleEditMemberChange(index, e.target.value)}
                        placeholder="Enter member name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      {currentTeam.members.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-red-600"
                          onClick={() => removeEditMemberField(index)}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700 flex items-center mt-2"
                    onClick={addEditMemberField}
                  >
                    <Plus size={16} className="mr-1" /> Add Another Member
                  </button>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Update Team
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-5 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Team</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the team "{currentTeam.name}"? This action cannot be undone.
                </p>
                
                <div className="flex justify-center gap-3">
                  <button
                    className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={handleDeleteTeam}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;