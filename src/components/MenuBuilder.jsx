import React, { useState } from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';

const MenuBuilder = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Function to add a new node or sub-node
  const addNode = (parentKey = null) => {
    const newNode = {
      key: `${Date.now()}`,
      title: newNodeName,
      children: [],
    };

    const updatedMenuData = [...menuData];
    if (parentKey === null) {
      // Add new category (root node)
      updatedMenuData.push(newNode);
    } else {
      // Add sub-category to specific category
      const findAndAddSubNode = (nodes) => {
        nodes.forEach((node) => {
          if (node.key === parentKey) {
            node.children = [...(node.children || []), newNode];
          } else if (node.children) {
            findAndAddSubNode(node.children);
          }
        });
      };
      findAndAddSubNode(updatedMenuData);
    }

    setMenuData(updatedMenuData);
    closeModal();
  };

  // Function to delete a node or sub-node
  const deleteNode = (keyToDelete) => {
    const filterNodes = (nodes) => {
      return nodes
        .filter((node) => node.key !== keyToDelete)
        .map((node) => ({
          ...node,
          children: node.children ? filterNodes(node.children) : [],
        }));
    };
    setMenuData(filterNodes(menuData));
  };

  // Function to handle node title edit
  const editNode = (keyToEdit) => {
    const updateNodes = (nodes) => {
      return nodes.map((node) => {
        if (node.key === keyToEdit) {
          return { ...node, title: newNodeName };
        } else if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setMenuData(updateNodes(menuData));
    closeModal();
  };

  // Open modal for adding or editing
  const openModal = (isEditingMode = false) => {
    setIsModalVisible(true);
    setIsEditing(isEditingMode);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalVisible(false);
    setNewNodeName('');
    setSelectedNode(null);
    setIsEditing(false);
  };

  // Confirm add/edit action based on the modal state
  const handleModalConfirm = () => {
    if (isEditing && selectedNode) {
      editNode(selectedNode);
    } else {
      addNode(selectedNode);
    }
  };

  const handleNodeSelect = (keys) => {
    setSelectedNode(keys[0] || null);
  };

  return (
    <div>
      <button onClick={() => openModal(false)}>Add Root Node</button>
      {selectedNode && (
        <>
          <button onClick={() => openModal(true)}>Edit Node</button>
          <button onClick={() => deleteNode(selectedNode)}>Delete Node</button>
          <button onClick={() => openModal(false)}>Add Sub-Node</button>
        </>
      )}
      <Tree
        treeData={menuData}
        selectable
        onSelect={handleNodeSelect}
        defaultExpandAll
      />

      {/* Custom Modal */}
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Node' : 'Add Node'}</h3>
            <input
              type="text"
              placeholder="Enter node name"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleModalConfirm}>
                {isEditing ? 'Save' : 'Add'}
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal styles */}
      <style>{`
        
      `}</style>
    </div>
  );
};

export default MenuBuilder;
