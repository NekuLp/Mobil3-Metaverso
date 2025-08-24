export const goalVaultV2Abi = [
  // configureGoal(string,string,uint256,uint64) -> returns uint256 id
  {
    type: "function",
    name: "configureGoal",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "target", type: "uint256" },
      { name: "deadline", type: "uint64" }, // <-- clave
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  // deposit(uint256 id, uint256 amount)
  {
    type: "function",
    name: "deposit",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  // withdraw(uint256 id)
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  // canWithdraw(uint256 id) view returns (bool)
  {
    type: "function",
    name: "canWithdraw",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  // goals(uint256) view -> (owner,title,description,target,deadline,deposited,archived)
  {
    type: "function",
    name: "goals",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "owner", type: "address" },
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "target", type: "uint256" },
      { name: "deadline", type: "uint64" },
      { name: "deposited", type: "uint256" },
      { name: "archived", type: "bool" },
    ],
  },
  // userGoalsOf(address) view returns (uint256[])
  {
    type: "function",
    name: "userGoalsOf",
    stateMutability: "view",
    inputs: [{ name: "u", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  // events (usamos los necesarios para parsear)
  {
    type: "event",
    name: "GoalConfigured",
    inputs: [
      { indexed: true,  name: "user",    type: "address" },
      { indexed: true,  name: "goalId",  type: "uint256" },
      { indexed: false, name: "target",  type: "uint256" },
      { indexed: false, name: "deadline",type: "uint64"  },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GoalCreated",
    inputs: [
      { indexed: true, name: "user",   type: "address" },
      { indexed: true, name: "goalId", type: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DepositMade",
    inputs: [
      { indexed: true,  name: "user",   type: "address" },
      { indexed: true,  name: "goalId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { indexed: true,  name: "user",   type: "address" },
      { indexed: true,  name: "goalId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Archived",
    inputs: [
      { indexed: true, name: "user",   type: "address" },
      { indexed: true, name: "goalId", type: "uint256" },
    ],
    anonymous: false,
  },
] as const;
