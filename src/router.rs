use path_tree::PathTree;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
pub struct Router {
    tree: PathTree<usize>,
}

impl Default for Router {
    fn default() -> Self {
        Self {
            tree: PathTree::<usize>::new(),
        }
    }
}

#[wasm_bindgen]
impl Router {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Router { ..Self::default() }
    }

    pub fn insert(&mut self, path: &str, idx: usize) {
        self.tree.insert(path, idx);
    }

    pub fn lookup(&self, path: &str) -> isize {
        match self.tree.find(path) {
            Some(v) => *v.0 as isize,
            None => -1,
        }
    }
}
