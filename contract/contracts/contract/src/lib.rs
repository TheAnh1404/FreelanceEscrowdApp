#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env,
};

// ===== STORAGE KEYS =====
#[contracttype]
pub enum DataKey {
    Client,
    Freelancer,
    Amount,
    Token,
    Funded,
    Initialized,
}

// ===== CONTRACT =====
#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {

    // INIT
    pub fn init(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        amount: i128,
    ) {
        client.require_auth();

        // ❗ tránh init lại
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }

        env.storage().instance().set(&DataKey::Client, &client);
        env.storage().instance().set(&DataKey::Freelancer, &freelancer);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::Amount, &amount);
        env.storage().instance().set(&DataKey::Funded, &false);
        env.storage().instance().set(&DataKey::Initialized, &true);
    }

    // DEPOSIT
    pub fn deposit(env: Env, client: Address) {
        client.require_auth();

        let stored_client: Address = env.storage().instance().get(&DataKey::Client).unwrap();
        if client != stored_client {
            panic!("Not client");
        }

        let funded: bool = env.storage().instance().get(&DataKey::Funded).unwrap();
        if funded {
            panic!("Already funded");
        }

        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let amount: i128 = env.storage().instance().get(&DataKey::Amount).unwrap();

        let token_client = soroban_sdk::token::Client::new(&env, &token);

        token_client.transfer(
            &client,
            &env.current_contract_address(),
            &amount,
        );

        env.storage().instance().set(&DataKey::Funded, &true);
    }

    // RELEASE
    pub fn release(env: Env, client: Address) {
        client.require_auth();

        let stored_client: Address = env.storage().instance().get(&DataKey::Client).unwrap();
        if client != stored_client {
            panic!("Not client");
        }

        let funded: bool = env.storage().instance().get(&DataKey::Funded).unwrap();
        if !funded {
            panic!("Not funded");
        }

        let freelancer: Address = env.storage().instance().get(&DataKey::Freelancer).unwrap();
        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let amount: i128 = env.storage().instance().get(&DataKey::Amount).unwrap();

        let token_client = soroban_sdk::token::Client::new(&env, &token);

        token_client.transfer(
            &env.current_contract_address(),
            &freelancer,
            &amount,
        );

        env.storage().instance().set(&DataKey::Funded, &false);
    }

    // REFUND
    pub fn refund(env: Env, client: Address) {
        client.require_auth();

        let stored_client: Address = env.storage().instance().get(&DataKey::Client).unwrap();
        if client != stored_client {
            panic!("Not client");
        }

        let funded: bool = env.storage().instance().get(&DataKey::Funded).unwrap();
        if !funded {
            panic!("Not funded");
        }

        let token: Address = env.storage().instance().get(&DataKey::Token).unwrap();
        let amount: i128 = env.storage().instance().get(&DataKey::Amount).unwrap();

        let token_client = soroban_sdk::token::Client::new(&env, &token);

        token_client.transfer(
            &env.current_contract_address(),
            &client,
            &amount,
        );

        env.storage().instance().set(&DataKey::Funded, &false);
    }
}